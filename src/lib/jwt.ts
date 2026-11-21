// ---------------------------------------------------------------------------
// JWT issuing for the Next.js app.
//
// better-auth remains the source of truth for login — it owns the session
// cookie and the users collection. This module only MINTS a short-lived
// bearer token that the Express backend can verify without a database
// round-trip (it shares JWT_SECRET, see FixMate-server/.env).
//
// `server-only` makes an accidental import from a client component throw at
// build time, so JWT_SECRET can never end up in the browser bundle.
// ---------------------------------------------------------------------------

import "server-only";
import jwt from "jsonwebtoken";

/**
 * Resolved eagerly at module load so a missing secret fails the build instead
 * of surfacing later as a mysterious 401 on every request.
 */
function requireSecret(): string {
  const value = process.env.JWT_SECRET;
  if (!value) {
    throw new Error("JWT_SECRET is not configured");
  }
  return value;
}

const secret = requireSecret();

export interface ApiTokenClaims {
  /** better-auth user id. */
  sub: string;
  email: string;
  role?: string;
  name?: string;
}

/**
 * Token lifetime. Short on purpose: the client refreshes automatically on a
 * 401, so a stolen token stops working within 15 minutes while a signed-in
 * user never notices the refresh.
 */
export const TOKEN_TTL_SECONDS = 15 * 60;

export function signApiToken(claims: ApiTokenClaims): string {
  return jwt.sign(claims, secret, { expiresIn: TOKEN_TTL_SECONDS });
}
