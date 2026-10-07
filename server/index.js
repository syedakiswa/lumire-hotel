import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";

import authRoutes from "./routes/auth.js";
import roomsRoutes from "./routes/rooms.js";
import bookingsRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";
import diningRoutes from "./routes/dining.js";
import contactRoutes from "./routes/contact.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Security and parser middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection middleware for serverless execution
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Database connection middleware error:", err.message);
  }
  next();
});

// Health check endpoint
app.get(["/api/health", "/health", "/api", "/"], (req, res) => {
  res.json({
    status: "ok",
    hotel: "LUMIÈRE GRAND HOTEL",
    timestamp: new Date().toISOString(),
  });
});

// API Routes (mounted with both /api prefix and direct path for seamless Vercel rewrites)
app.use(["/api/auth", "/auth"], authRoutes);
app.use(["/api/rooms", "/rooms"], roomsRoutes);
app.use(["/api/bookings", "/bookings"], bookingsRoutes);
app.use(["/api/admin", "/admin"], adminRoutes);
app.use(["/api/dining", "/dining"], diningRoutes);
app.use(["/api/contact", "/contact"], contactRoutes);

// 404 handler for unknown API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Requested API endpoint not found: ${req.method} ${req.originalUrl || req.url}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "An internal server error occurred.",
  });
});

// Only listen when running directly in local environment (not in Vercel serverless)
const isVercel = process.env.VERCEL === "1" || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
if (!isVercel) {
  connectDB().catch((err) => console.error("Database initialization error:", err));
  app.listen(PORT, () => {
    console.log(`LUMIÈRE Grand Hotel API server running on http://localhost:${PORT}`);
  });
}

export default app;
export { app };
