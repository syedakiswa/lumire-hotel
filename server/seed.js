import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "./db.js";
import { seedInitialData } from "./services/dataStore.js";

async function runSeed() {
  console.log("Seeding LUMIÈRE GRAND HOTEL database...");
  await connectDB();
  await seedInitialData();
  console.log("Database seeded successfully.");
  process.exit(0);
}

runSeed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
