
const TOKEN_ENDPOINT = "/api/auth/token";

interface CachedToken {
  token: string;

  staleAt: number;
}

const REFRESH_MARGIN_MS = 30_000;

const FALLBACK_TTL_MS = 15 * 60 * 1000;

let cached: CachedToken | null = null;

let inflight: Promise<string | null> | null = null;


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

function invalidateToken(): void {
  cached = null;
}


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

  
  if (!refreshed || refreshed === token) return res;

  return send(refreshed);
}
