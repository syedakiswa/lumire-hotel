import mongoose from "mongoose";
import { seedInitialData } from "./services/dataStore.js";

export async function connectDB() {
  const mongoUri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lumiere_hotel";

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 1500,
      connectTimeoutMS: 1500,
    });
    console.log("Connected to MongoDB database successfully.");
  } catch (error) {
    console.warn(
      `MongoDB connection notice (${error.message}). Resilient JSON data layer activated for development.`
    );
  }

  // Seed default dataset (admin, presidential suite, rooms)
  try {
    await seedInitialData();
    console.log("Initial seed data checked and ready.");
  } catch (seedErr) {
    console.error("Error during initial data check:", seedErr);
  }
}
