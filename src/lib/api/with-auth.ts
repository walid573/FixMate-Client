// ---------------------------------------------------------------------------
// Authenticated fetch for the Express backend.
//
// The backend requires `Authorization: Bearer <jwt>` on protected routes. The
// token is issued by better-auth's JWT plugin at GET /api/auth/token (the
// session cookie is exchanged for a signed JWT), so no custom token route is
// needed.
//
// The token is cached in module scope until shortly before it expires. On a
// 401 we assume it aged out, refresh once and retry; a second failure is
// returned to the caller unchanged so the UI shows the real error.
// ---------------------------------------------------------------------------

const TOKEN_ENDPOINT = "/api/auth/token";

interface CachedToken {
  token: string;
  /** Epoch ms at which the token should be considered stale. */
  staleAt: number;
}

/** Refresh this many ms before expiry to avoid racing the server. */
const REFRESH_MARGIN_MS = 30_000;
/** Fallback TTL if the token has no readable `exp` claim. */
const FALLBACK_TTL_MS = 15 * 60 * 1000;

let cached: CachedToken | null = null;
/** De-duplicates concurrent callers so one page never fires N token requests. */
let inflight: Promise<string | null> | null = null;

/** Reads `exp` from a JWT without verifying it — only used for cache timing. */
function expiryOf(token: string): number {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as { exp?: number };
    return payload.exp ? payload.exp * 1000 : Date.now() + FALLBACK_TTL_MS;
  } catch {
    return Date.now() + FALLBACK_TTL_MS;
  }
}

async function requestToken(): Promise<string | null> {
  try {
    const res = await fetch(TOKEN_ENDPOINT, {
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) return null;

    const data = (await res.json().catch(() => null)) as {
      token?: string;
    } | null;

    if (!data?.token) return null;

    cached = {
      token: data.token,
      staleAt: expiryOf(data.token) - REFRESH_MARGIN_MS,
    };
    return cached.token;
  } catch {
    // Offline or the endpoint is unreachable — behave like "not signed in".
    return null;
  }
}

function getToken(): Promise<string | null> {
  if (cached && Date.now() < cached.staleAt) {
    return Promise.resolve(cached.token);
  }

  if (!inflight) {
    inflight = requestToken().finally(() => {
      inflight = null;
    });
  }

  return inflight;
}

/** Drop the cached token so the next call re-fetches (used after a 401). */
function invalidateToken(): void {
  cached = null;
}

/**
 * fetch() that attaches the backend JWT when one is available.
 *
 * Safe to use while signed out: no token simply means no Authorization
 * header, and the server replies 401 for protected routes as usual.
 *
 * The automatic retry only happens when the request body can be sent twice
 * (a string or no body). All mutations here send JSON strings, so nothing is
 * consumed twice.
 */
export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const token = await getToken();

  const send = (bearer: string | null): Promise<Response> => {
    const headers = new Headers(init.headers);
    if (bearer) headers.set("Authorization", `Bearer ${bearer}`);
    return fetch(input, { ...init, headers });
  };

  const res = await send(token);

  const retryable =
    res.status === 401 &&
    token !== null &&
    (init.body === undefined || typeof init.body === "string");

  if (!retryable) return res;

  invalidateToken();
  const refreshed = await getToken();

  // Same token came back (or none) — nothing to gain, surface the 401.
  if (!refreshed || refreshed === token) return res;

  return send(refreshed);
}
