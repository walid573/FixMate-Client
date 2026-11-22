import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { getMongoState, isMongoHealthy, resetMongoState } from "./mongo";
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

function buildAuth() {
  const { client, db } = getMongoState();

  return betterAuth({
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
        jwks: {
          remoteUrl: `${baseURL}/api/auth/jwks`,
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
            return jwtSign.sign(claims, jwtSecret!, { algorithm: "HS256" });
          },
        },
      }),
    ],

    // mongodbAdapter captures this Db at construction time. mongo.ts owns the
    // client lifecycle; authSelfHeal below replaces both when it dies.
    database: mongodbAdapter(db, { client }),
  });
}

type Auth = ReturnType<typeof buildAuth>;

let current: Auth = buildAuth();
let rebuildPromise: Promise<void> | null = null;

function rebuildNow() {
  resetMongoState();
  current = buildAuth();
}

async function rebuild(): Promise<void> {
  if (!rebuildPromise) {
    rebuildPromise = Promise.resolve()
      .then(() => {
        rebuildNow();
      })
      .finally(() => {
        rebuildPromise = null;
      });
  }
  await rebuildPromise;
}

// The MongoDB driver only raises MongoTopologyClosedError after client.close()
// clears `client.topology`. Detect that between requests so the next call uses
// a fresh client instead of the stale Db captured by the adapter.
function refreshIfDead() {
  if (!isMongoHealthy()) rebuildNow();
}

function isDbFailure(error: unknown): boolean {
  let cause: any = error;
  for (let i = 0; i < 6 && cause; i++) {
    const name = String(cause.name ?? "");
    const message = String(cause.message ?? "");
    if (
      name === "MongoTopologyClosedError" ||
      name === "MongoClientClosedError" ||
      name === "MongoServerSelectionError" ||
      name === "MongoNetworkError" ||
      message.includes("Topology is closed") ||
      message.includes("Server selection timed out")
    ) {
      return true;
    }
    cause = cause.cause;
  }
  return false;
}

const apiProxy = new Proxy({} as Auth["api"], {
  get(_target, prop) {
    if (typeof prop !== "string") return undefined;
    return async (...args: unknown[]) => {
      refreshIfDead();
      try {
        return await (current.api as any)[prop](...args);
      } catch (error) {
        if (!isDbFailure(error)) throw error;
        await rebuild();
        return (current.api as any)[prop](...args);
      }
    };
  },
});

// Sign-up / sign-in go through auth.handler, which converts DB errors into a
// plain 500 Response rather than throwing. Retry those once with a fresh client.
const handlerProxy = async (request: Request): Promise<Response> => {
  refreshIfDead();
  try {
    const response = await current.handler(request);
    if (response.status !== 500) return response;
    await response.arrayBuffer();
    await rebuild();
    return current.handler(request);
  } catch (error) {
    if (!isDbFailure(error)) throw error;
    await rebuild();
    return current.handler(request);
  }
};

// Stable export so every existing `auth.api.*` / `auth.handler` call site keeps
// working, while the underlying instance is swapped out when Mongo dies.
export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    if (prop === "api") return apiProxy;
    if (prop === "handler") return handlerProxy;
    refreshIfDead();
    const value = (current as any)[prop];
    if (typeof prop === "symbol") return value;
    return typeof value === "function" ? value.bind(current) : value;
  },
  has(_target, prop) {
    return prop === "api" || prop === "handler" || prop in current;
  },
});
