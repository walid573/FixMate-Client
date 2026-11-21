
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const mongoUrl = process.env.MONGODB_URL;

if (!mongoUrl) {
  throw new Error("MONGODB_URL is not configured");
}

const client = new MongoClient(mongoUrl);

await client.connect();

const db = client.db("fixmate");

export const auth = betterAuth({
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
        // Must be client-settable so the register page can actually persist
        // the chosen role. With input: false the server ignores the client
        // value and always falls back to the default ("customer").
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
  plugins: [
    jwt({
      jwt: {
        expirationTime: "15m",

        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          role: user.role,
        }),
      },
    }),
  ],

  database: mongodbAdapter(db, {
    client,
  }),
});
