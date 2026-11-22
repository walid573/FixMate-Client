import { MongoClient } from "mongodb";

// One client per serverless module instance with a SMALL pool. Do not cache on
// globalThis or set maxIdleTimeMS: in a frozen serverless runtime the driver's
// monitor can mark a shared/idle topology as closed and every later request
// then fails with "Topology is closed".
const uri = process.env.MONGODB_URL;
if (!uri) throw new Error("MONGODB_URL is not configured");

export const mongoClient = new MongoClient(uri, {
  maxPoolSize: 5,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 10_000,
  waitQueueTimeoutMS: 5_000,
});
