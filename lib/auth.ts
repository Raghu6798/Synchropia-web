import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { genericOAuth, magicLink, jwt } from "better-auth/plugins";
import prisma from "./prisma";
import nodemailer from "nodemailer";

// Configure Nodemailer for sending magic links via SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "user",
    pass: process.env.SMTP_PASSWORD || "pass",
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      organizationId: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "viewer",
      },
    },
  },

  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  session: {
    expiresIn: 60 * 60 * 8, // 8 hours
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET || "",
    },
    gitlab: {
      clientId: process.env.GITLAB_OAUTH_CLIENT_ID || "",
      clientSecret: process.env.GITLAB_OAUTH_CLIENT_SECRET || "",
    },
  },

  plugins: [
    jwt(), // Enforces client-side JWTs for sessions

    magicLink({
      sendMagicLink: async ({ email, url }) => {
        try {
          await transporter.sendMail({
            from:
              process.env.SMTP_FROM || '"Synchropia" <no-reply@synchropia.dev>',
            to: email,
            subject: "Your Magic Link to Sign In",
            text: `Click the link to sign in: ${url}`,
            html: `<p>Click the link to sign in: <a href="${url}">${url}</a></p>`,
          });
          console.log(`Magic link sent to ${email}`);
        } catch (error) {
          console.error("Failed to send magic link via SMTP", error);
        }
      },
    }),

    genericOAuth({
      config: [
        {
          providerId: "okta",
          clientId: process.env.OKTA_CLIENT_ID || "",
          clientSecret: process.env.OKTA_CLIENT_SECRET || "",
          authorizationUrl: `${process.env.OKTA_ISSUER}/oauth2/v1/authorize`,
          tokenUrl: `${process.env.OKTA_ISSUER}/oauth2/v1/token`,
          userInfoUrl: `${process.env.OKTA_ISSUER}/oauth2/v1/userinfo`,
          scopes: ["openid", "profile", "email", "groups"],
          pkce: true,
        },
        {
          providerId: "bitbucket",
          clientId: process.env.BITBUCKET_CLIENT_ID || "",
          clientSecret: process.env.BITBUCKET_CLIENT_SECRET || "",
          authorizationUrl: "https://bitbucket.org/site/oauth2/authorize",
          tokenUrl: "https://bitbucket.org/site/oauth2/access_token",
          userInfoUrl: "https://api.bitbucket.org/2.0/user",
          scopes: ["email", "account"],
          pkce: true,
        },
      ],
    }),
  ],
});
