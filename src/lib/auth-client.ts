import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  // In the browser always call the site we're actually on (localhost, preview
  // or production). A build-time NEXT_PUBLIC_ env var gets baked into the
  // bundle and caused production to call http://localhost:3000.
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BETTER_AUTH_URL,

  plugins: [
    inferAdditionalFields<typeof auth>(),
  ],
});

export const { 
  signIn, 
  signUp, 
  useSession, 
} = authClient;
