/**
 * Main Backend Server
 * Express.js API server for Ubuntu Health Vault
 * Handles SMS requests, patient check-ins, and medical record access
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import checkinRoutes from "./routes/checkin.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Ubuntu Health Vault Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/checkin", checkinRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.path,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║  Ubuntu Health Vault Backend                         ║
║  Server running on http://localhost:${PORT}          ║
║  Frontend: ${FRONTEND_URL}
║  Environment: ${process.env.NODE_ENV || "development"}  ║
╚══════════════════════════════════════════════════════╝
  `);
  
  // Check if Africa's Talking credentials are configured
  if (!process.env.AFRICAS_TALKING_API_KEY || !process.env.AFRICAS_TALKING_USERNAME) {
    console.warn("⚠️  WARNING: Africa's Talking credentials not configured!");
    console.warn("   SMS functionality will not work until you set:");
    console.warn("   - AFRICAS_TALKING_API_KEY");
    console.warn("   - AFRICAS_TALKING_USERNAME");
    console.warn("\n   Create a .env file based on .env.example\n");
  }
});
