import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/codecraft-studio";

// Use a global cache so hot-reloading in dev does not create endless
// connection pools to MongoDB Atlas.
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

export async function connectDb(): Promise<typeof mongoose> {
  if (globalThis.mongooseCache?.conn) {
    return globalThis.mongooseCache.conn;
  }

  if (!globalThis.mongooseCache) {
    globalThis.mongooseCache = {
      conn: null,
      promise: null,
    };
  }

  if (!globalThis.mongooseCache.promise) {
    globalThis.mongooseCache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    globalThis.mongooseCache.conn = await globalThis.mongooseCache.promise;
  } catch (error) {
    globalThis.mongooseCache.promise = null;
    throw error;
  }

  return globalThis.mongooseCache.conn;
}