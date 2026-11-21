
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import jwtSign from "jsonwebtoken";

const mongoUrl = process.env.MONGODB_URL;
const baseURL = process.env.BETTER_AUTH_URL;
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
      jwks: {
        remoteUrl: `${baseURL}/api/auth/jwks`,
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
