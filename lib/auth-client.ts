import { createAuthClient } from "better-auth/react";
import { genericOAuthClient, magicLinkClient, jwtClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    genericOAuthClient(),
    magicLinkClient(),
    jwtClient(),
    inferAdditionalFields<typeof auth>()
  ]
});

export const { signIn, signOut, useSession } = authClient;
