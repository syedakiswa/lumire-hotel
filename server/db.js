import mongoose from "mongoose";
import { seedInitialData } from "./services/dataStore.js";

/**
 * Global connection cache for serverless environments (e.g. Vercel).
 * Global variables persist across warm invocations in serverless runtimes.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, seeded: false, lastFailedTime: 0 };
}

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("Notice: MONGO_URI environment variable is not defined. Database connection skipped.");
    return null;
  }

  // Reuse existing active connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Prevent spamming connection attempts if connection failed very recently (cooldown 30s)
  if (Date.now() - cached.lastFailedTime < 30000) {
    return null;
  }

  // If connection is already being established, await that existing promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    };

    cached.promise = mongoose
      .connect(mongoUri, opts)
      .then((m) => {
        console.log("Connected to MongoDB database successfully.");
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        cached.lastFailedTime = Date.now();
        console.error("MongoDB connection notice:", err.message);
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.lastFailedTime = Date.now();
    return null;
  }

  // Run initial seed check once per container lifecycle
  if (!cached.seeded && mongoose.connection.readyState === 1) {
    try {
      await seedInitialData();
      cached.seeded = true;
      console.log("Initial seed data checked and ready.");
    } catch (seedErr) {
      console.error("Error during initial data check:", seedErr.message);
    }
  }

  return cached.conn;
}

export default connectDB;
