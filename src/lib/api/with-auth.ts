// ---------------------------------------------------------------------------
// Authenticated fetch for the Express backend.
//
// The backend now requires `Authorization: Bearer <jwt>` on every mutating
// route (POST/PATCH/PUT/DELETE). GETs stay public, so read paths are
// untouched — only writers opt in via `authFetch`.
//
// The token is fetched from /api/token on demand and cached in module scope
// with its expiry. On a 401 we assume the token aged out, refresh once and
// retry; a second failure is returned to the caller unchanged so the UI shows
// the real error instead of looping.
// ---------------------------------------------------------------------------

interface CachedToken {
  token: string;
  /** Epoch ms at which the token should be considered stale. */
  staleAt: number;
}

/** Refresh this many ms before the server-side expiry to avoid racing it. */
const REFRESH_MARGIN_MS = 30_000;

let cached: CachedToken | null = null;
/** De-duplicates concurrent callers so one page never fires N token requests. */
let inflight: Promise<string | null> | null = null;

async function requestToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/token", { cache: "no-store" });
    if (!res.ok) return null;

    const data = (await res.json().catch(() => null)) as {
      token?: string;
      expiresIn?: number;
    } | null;

    if (!data?.token) return null;

    const ttlMs = (data.expiresIn ?? 900) * 1000;
    cached = {
      token: data.token,
      staleAt: Date.now() + ttlMs - REFRESH_MARGIN_MS,
    };
    return cached.token;
  } catch {
    // Offline or the route is unreachable — behave like "not signed in".
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
 * The single automatic retry only happens when the request body can be sent
 * twice (a string or no body). All backend mutations here send JSON strings,
 * so this covers every real case without risking a consumed stream.
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
