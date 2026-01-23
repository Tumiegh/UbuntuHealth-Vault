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
import recordsRoutes from "./routes/records.js";
import smsWebhookRoutes from "./routes/smsWebhook.js";
import accessRoutes from "./routes/access.js";
import ussdRoutes from "./routes/ussd.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
app.use("/api/records", recordsRoutes);
app.use("/api/sms", smsWebhookRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/ussd", ussdRoutes);

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

  // Check if IPFS/Storacha credentials are configured
  if (!process.env.W3UP_EMAIL) {
    console.warn("⚠️  WARNING: Storacha (IPFS) credentials not configured!");
    console.warn("   File upload functionality will not work until you set:");
    console.warn("   - W3UP_EMAIL");
    console.warn("\n   Visit https://web3.storage to create an account\n");
  }

  // Check if encryption key is configured
  if (!process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY.length < 32) {
    console.warn("⚠️  WARNING: ENCRYPTION_KEY not set or too short!");
    console.warn("   Using default key (NOT SECURE FOR PRODUCTION)");
    console.warn("   Set a strong 32+ character ENCRYPTION_KEY in .env\n");
  }

  // Check if blockchain configuration is set
  if (!process.env.BASE_SEPOLIA_RPC_URL || !process.env.HEALTH_VAULT_CONTRACT_ADDRESS) {
    console.warn("⚠️  WARNING: Blockchain configuration not complete!");
    console.warn("   Blockchain features will not work until you set:");
    console.warn("   - BASE_SEPOLIA_RPC_URL");
    console.warn("   - HEALTH_VAULT_CONTRACT_ADDRESS");
    console.warn("\n   Deploy the smart contract first using: cd contracts && npm run deploy\n");
  }
});
