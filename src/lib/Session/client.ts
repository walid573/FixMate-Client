
"use client";

import { authClient } from "../auth-client";

export const useSessionClient = () => {
  return authClient.useSession();
};
