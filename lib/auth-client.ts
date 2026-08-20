import { createAuthClient } from "better-auth/react";
import { magicLinkClient, jwtClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    magicLinkClient(),
    jwtClient(),
    inferAdditionalFields<typeof auth>()
  ]
});

export const { signIn, signOut, useSession } = authClient;
