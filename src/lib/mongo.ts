import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URL;
if (!uri) throw new Error("MONGODB_URL is not configured");

const DB_NAME = "fixmate";

type MongoState = {
  client: MongoClient;
  db: Db;
  ready: Promise<void>;
};

const globalForMongo = globalThis as typeof globalThis & {
  __fixmateAuthMongoState?: MongoState;
};

function createState(): MongoState {
  const client = new MongoClient(uri!, {
    maxPoolSize: 5,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 15_000,
    waitQueueTimeoutMS: 10_000,
    retryWrites: true,
    retryReads: true,
  });

  // Connect explicitly and memoize the promise. BetterAuth captures the Db at
  // module load, so the client must already be usable when it gets the Db.
  const ready = client.connect().then(() => undefined);
  // Prevent an unhandled rejection on cold starts where Atlas is unreachable;
  // the first real operation will still surface the error.
  ready.catch(() => undefined);

  return { client, db: client.db(DB_NAME), ready };
}

export function getMongoState(): MongoState {
  if (!globalForMongo.__fixmateAuthMongoState) {
    globalForMongo.__fixmateAuthMongoState = createState();
  }
  return globalForMongo.__fixmateAuthMongoState;
}

export function getMongoClient(): MongoClient {
  return getMongoState().client;
}

// The driver sets topology = undefined inside client.close(). That is the only
// way a MongoTopologyClosedError can occur, so this is a reliable health check.
export function isMongoHealthy(): boolean {
  const state = globalForMongo.__fixmateAuthMongoState;
  return !!state && (state.client as unknown as { topology?: unknown }).topology != null;
}

// Drop a dead/frozen topology so the next request starts with a fresh client.
export function resetMongoState(): void {
  const state = globalForMongo.__fixmateAuthMongoState;
  globalForMongo.__fixmateAuthMongoState = undefined;
  if (state) {
    try {
      void state.client.close();
    } catch {
      // Already closed — nothing to do.
    }
  }
}

// Backwards-compatible exports for modules that imported the old singleton.
export const mongoClient = getMongoState().client;
export const mongoDb = getMongoState().db;
export const mongoReady = getMongoState().ready;
