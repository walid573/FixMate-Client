import "server-only";
import { headers } from "next/headers";
import { auth } from "../auth";



export const getSessionServer = async()=>{
    const session = await auth.api.getSession({
        headers: await headers(),
      });
      return session
}


async function getToken(): Promise<string | null> {
  try {
    const res = await auth.api.getToken({ headers: await headers() });
    return res?.token ?? null;
  } catch {
    // Not signed in.
    return null;
  }
}

export async function authFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = await getToken();

  const h = new Headers(init.headers);
  if (token) h.set("Authorization", `Bearer ${token}`);
  if (init.body && !h.has("Content-Type")) {
    h.set("Content-Type", "application/json");
  }

  // `path` may already be an absolute URL (some callers pass
  // `${NEXT_PUBLIC_API_URL}/bookings`), in which case we must not prepend
  // BASE_URL again, or the URL gets doubled (e.g. ...8000http://...8000/...).
  const url = /^https?:\/\//i.test(path) ? path : `${process.env.BASE_URL}${path}`;

  return fetch(url, {
    cache: "no-store",
    ...init,
    headers: h,
  });
}