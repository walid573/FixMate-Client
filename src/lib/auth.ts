import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("fixmate");

export const auth = betterAuth({
    emailAndPassword: {    
        enabled: true
    } ,
     user: {
    additionalFields: {
      phone: {
        type: "string",
        required: true,
      },
       role: {
      type: "string",
      required: true,
    },
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
});