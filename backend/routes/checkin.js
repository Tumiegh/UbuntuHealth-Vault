/**
 * Check-In Routes
 * Handles patient check-in operations and SMS access requests
 */

import express from "express";
import { formatPhoneNumber, isValidSouthAfricanNumber } from "../utils/phoneValidator.js";
import { sendAccessRequestSMS } from "../services/smsService.js";

const router = express.Router();

/**
 * POST /api/checkin
 * Initiates a new patient check-in and sends SMS access request
 * 
 * Request body:
 * {
 *   "patientName": "string",
 *   "phoneNumber": "string (any format)",
 *   "idNumber": "string (optional)"
 * }
 * 
 * Response (success):
 * {
 *   "success": true,
 *   "message": "Access request sent to patient",
 *   "patientName": "string",
 *   "phoneNumber": "string (formatted)",
 *   "timestamp": "ISO string"
 * }
 * 
 * Response (error):
 * {
 *   "success": false,
 *   "error": "error message"
 * }
 */
router.post("/", async (req, res) => {
  try {
    const { patientName, phoneNumber, idNumber } = req.body;

    // Validate required fields
    if (!patientName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: "Patient name and phone number are required",
      });
    }

    // Format and validate phone number
    const formattedNumber = formatPhoneNumber(phoneNumber);
    if (!formattedNumber) {
      return res.status(400).json({
        success: false,
        error: `Invalid phone number format. Please use format like +27824556325 or 0824556325`,
      });
    }

    // Send SMS access request
    const smsResult = await sendAccessRequestSMS(formattedNumber, patientName);

    // Log check-in for audit trail
    console.log(`Check-in initiated for ${patientName} (${idNumber || "No ID"}) at ${formattedNumber}`);

    // Return success response
    res.status(200).json({
      success: true,
      message: "Access request sent to patient",
      patientName,
      phoneNumber: formattedNumber,
      idNumber: idNumber || null,
      timestamp: new Date().toISOString(),
      smsStatus: smsResult.MessagesPart?.[0]?.Status || "sent",
    });
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process check-in",
    });
  }
});

export default router;
