import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

type CachedMongoose = {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
};
type GlobalWithMongoose = typeof globalThis & { mongoose?: CachedMongoose };
const globalWithMongoose = global as GlobalWithMongoose;
const cached: CachedMongoose = globalWithMongoose.mongoose || { conn: null, promise: null };

export default async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongooseInstance) => {
      return mongooseInstance.connection;
    });
  }
  cached.conn = await cached.promise;
  globalWithMongoose.mongoose = cached;
  return cached.conn;
}
