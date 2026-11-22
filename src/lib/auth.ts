import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { mongoClient } from "./mongo";
import { jwt } from "better-auth/plugins";
import jwtSign from "jsonwebtoken";

const baseURL = process.env.BETTER_AUTH_URL;
const jwtSecret = process.env.JWT_SECRET;

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL is not configured");
}

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

export const auth = betterAuth({
  baseURL,

  // Origins allowed to call the auth API. Without the right one here the
  // browser gets "Invalid origin" on sign-in. The production domain is
  // included explicitly because the earlier preview URL redirects to it.
  trustedOrigins: [
    baseURL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    process.env.CLIENT_URL,
    process.env.CLIENT_URLS,
    "https://fixmate-client24.vercel.app",
    "https://fixmate-client-wine.vercel.app",
    "http://localhost:3000",
  ]
    .flatMap((value) => (value || "").split(","))
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: () => ({ phone: "", role: "customer" }),
    },
  },

  user: {
    modelName: "users",

    additionalFields: {
      phone: {
        type: "string",
        required: false,
        input: true,
      },

      role: {
        type: ["customer", "technician", "admin"],
        required: false,
        defaultValue: "customer",
        input: true,
      },

      area: {
        type: "string",
        required: false,
        input: true,
      },

      bio: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Server-side guard: only "customer" and "technician" may be chosen at
        // signup. Anything else (admin, a typo, a hand-crafted request) is
        // stored as "customer" — the UI hiding the admin option is not enough.
        before: async (user) => ({
          data: {
            ...user,
            role:
              user.role === "customer" || user.role === "technician"
                ? user.role
                : "customer",
          },
        }),
      },
    },
  },

  plugins: [
    jwt({
      // Required by better-auth whenever a custom jwt.sign is used. Not actually
      // consumed here: the Express server verifies the HS256 token with the
      // shared JWT_SECRET, not via JWKS.
      jwks: {
        remoteUrl: `${baseURL}/api/auth/jwks`,
        // Metadata only - better-auth requires it alongside remoteUrl. It does
        // not change how tokens are signed (still HS256 via jwt.sign below).
        keyPairConfig: { alg: "ES256" },
      },

      jwt: {
        expirationTime: "15m",
        issuer: baseURL,
        audience: baseURL,

        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          role: user.role,
        }),

        sign: (payload) => {
          const claims = Object.fromEntries(
            Object.entries(payload).filter(([, value]) => value !== undefined)
          );
          return jwtSign.sign(claims, jwtSecret, { algorithm: "HS256" });
        },
      },
    }),
  ],

  database: mongodbAdapter(mongoClient.db("fixmate"), {
    client: mongoClient,
  }),
});