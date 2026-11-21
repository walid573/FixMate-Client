
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import jwtSign from "jsonwebtoken";

const mongoUrl = process.env.MONGODB_URL;
const baseURL = process.env.BETTER_AUTH_URL;
// Shared with FixMate-server (its .env has the same value). The Express API
// verifies every Bearer token with this secret, so tokens must be HS256.
const jwtSecret = process.env.JWT_SECRET;

if (!mongoUrl) {
  throw new Error("MONGODB_URL is not configured");
}

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL is not configured");
}

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

const client = new MongoClient(mongoUrl);

await client.connect();

const db = client.db("fixmate");

export const auth = betterAuth({
  baseURL,

  emailAndPassword: {
    enabled: true,
  },

  user: {
    modelName: "users",

    additionalFields: {
      phone: {
        type: "string",
        required: true,
      },

      role: {
        type: ["customer", "technician", "admin"],
        required: false,
        defaultValue: "customer",
        // Must be client-settable so the register page can persist the role
        // the user picked (customer or technician). "admin" is blocked below.
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

  // Signup accepts customer/technician, but a crafted request must never be
  // able to create an admin account.
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            role: user.role === "admin" ? "customer" : user.role,
          },
        }),
      },
    },
  },

  plugins: [
    jwt({
      // The plugin requires a remote JWKS URL whenever `jwt.sign` is
      // overridden. Verification happens on Express with the shared secret,
      // so this URL is only declared to satisfy that check and is never used.
      jwks: {
        remoteUrl: "http://localhost:3000/api/auth/jwks",
        keyPairConfig: { alg: "RS256" },
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

        // By default the plugin signs EdDSA with its own key pair, which
        // jsonwebtoken (Express) rejects for an HMAC secret. Sign HS256 with
        // the shared JWT_SECRET so `jwt.verify(token, secret)` works there.
        //
        // The plugin passes `iat`/`nbf` even when undefined and jsonwebtoken
        // refuses registered claims that are not numbers, so drop those.
        sign: (payload) => {
          const claims = Object.fromEntries(
            Object.entries(payload).filter(([, value]) => value !== undefined)
          );
          return jwtSign.sign(claims, jwtSecret, { algorithm: "HS256" });
        },
      },
    }),
  ],

  database: mongodbAdapter(db, {
    client,
  }),
});
