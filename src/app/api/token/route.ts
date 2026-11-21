// ---------------------------------------------------------------------------
// GET /api/token
//
// Exchanges the better-auth session cookie for a short-lived JWT that the
// browser attaches to mutating requests against the Express backend.
//
// Lives at /api/token rather than /api/auth/token so it cannot collide with
// better-auth's own catch-all at /api/auth/[...all].
//
// Always dynamic: it reads the session cookie through headers(). Returns 401
// when nobody is signed in — the caller then simply omits the Authorization
// header and the backend answers with its own "please sign in" message.
// ---------------------------------------------------------------------------

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { signApiToken, TOKEN_TTL_SECONDS } from "@/lib/jwt";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user?.id || !user.email) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  const token = signApiToken({
    sub: user.id,
    email: user.email,
    // additionalFields in src/lib/auth.ts — typed through better-auth.
    role: (user as { role?: string }).role,
    name: user.name,
  });

  return Response.json({ token, expiresIn: TOKEN_TTL_SECONDS });
}
