// Shared helper for "log in, then take me back where I was".
//
// RequestRepairSection sends ?callbackUrl=/services/<id> to the auth pages.
// Only same-site absolute paths are accepted so the parameter can never be
// used as an open redirect (e.g. //evil.com or https://evil.com).
const SAFE_PATH = /^\/(?!\/|\\)/;

export function getSafeCallbackUrl(fallback = "/"): string {
  if (typeof window === "undefined") return fallback;
  const value = new URLSearchParams(window.location.search).get("callbackUrl");
  return value && SAFE_PATH.test(value) ? value : fallback;
}

export function withCallbackUrl(path: string, callback: string): string {
  return callback && callback !== "/"
    ? `${path}?callbackUrl=${encodeURIComponent(callback)}`
    : path;
}

const DASHBOARDS: Record<string, string> = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
};

// Landing page after auth: where the user was heading wins, otherwise their
// own role dashboard. Unknown roles fall back to "customer".
export function getPostAuthUrl(role?: string | null): string {
  return DASHBOARDS[role ?? ""] ?? DASHBOARDS.customer;
}
