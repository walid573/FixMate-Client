import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,

  plugins: [
    inferAdditionalFields<typeof auth>(),jwtClient(),
  ],
});

export const {
  signIn,
  signUp,
  useSession,
} = authClient;
