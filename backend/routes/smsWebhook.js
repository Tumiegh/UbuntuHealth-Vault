/**
 * SMS Webhook Routes
 * Handles incoming SMS replies from Africa's Talking API
 */

import express from "express";
import {
  handleSMSReply,
  getAllReplies,
  getReplyById,
  getRepliesSummary,
  markReplyAsProcessed,
} from "../services/smsReplyService.js";

const router = express.Router();

/**
 * POST /api/sms/callback
 * Africa's Talking SMS delivery/reply webhook endpoint
 *
 * Webhook payload from AfricaTalking:
 * {
 *   "from": "+254XXXXXXXXX",
 *   "text": "YES|NO",
 *   "id": "message_id",
 *   "date": "2026-01-23T10:30:00Z",
 *   "linkId": "link_id"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "response": "YES|NO",
 *   "phoneNumber": "+254XXXXXXXXX"
 * }
 */
router.post("/callback", async (req, res) => {
  try {
    const payload = req.body;

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📱 [SMS WEBHOOK] Incoming callback received");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Payload:", JSON.stringify(payload, null, 2));

    // Process the reply
    const result = await handleSMSReply(payload);

    console.log("Processing result:", result);

    if (!result.success) {
      console.error("❌ Failed to process reply:", result.error);
      return res.status(400).json(result);
    }

    console.log("✅ Reply processed successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Respond to AfricaTalking webhook (must return 200 to acknowledge receipt)
    res.status(200).json({
      success: true,
      message: "Callback processed successfully",
      ...result,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process webhook",
    });
  }
});

/**
 * GET /api/sms/replies
 * Get all SMS replies with optional filters
 *
 * Query parameters:
 * - response: Filter by response type (YES/NO)
 * - phoneNumber: Filter by phone number
 * - processed: Filter by processed status (true/false)
 *
 * Response:
 * {
 *   "success": true,
 *   "count": number,
 *   "replies": [...]
 * }
 */
router.get("/replies", async (req, res) => {
  try {
    const { response, phoneNumber, processed } = req.query;

    const options = {};
    if (response) options.response = response.toUpperCase();
    if (phoneNumber) options.phoneNumber = phoneNumber;
    if (processed !== undefined)
      options.processed = processed === "true" ? true : false;

    const replies = await getAllReplies(options);

    res.json({
      success: true,
      count: replies.length,
      replies: replies,
    });
  } catch (error) {
    console.error("Error fetching replies:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch replies",
    });
  }
});

/**
 * GET /api/sms/replies/:messageId
 * Get a specific SMS reply by message ID
 *
 * Response:
 * {
 *   "success": true,
 *   "reply": {...}
 * }
 */
router.get("/replies/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;

    const reply = await getReplyById(messageId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        error: "Reply not found",
      });
    }

    res.json({
      success: true,
      reply: reply,
    });
  } catch (error) {
    console.error("Error fetching reply:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch reply",
    });
  }
});

/**
 * POST /api/sms/replies/:messageId/mark-processed
 * Mark a reply as processed
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Reply marked as processed"
 * }
 */
router.post("/replies/:messageId/mark-processed", async (req, res) => {
  try {
    const { messageId } = req.params;

    const success = await markReplyAsProcessed(messageId);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: "Reply not found",
      });
    }

    res.json({
      success: true,
      message: "Reply marked as processed",
    });
  } catch (error) {
    console.error("Error marking reply as processed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to mark reply as processed",
    });
  }
});

/**
 * GET /api/sms/summary
 * Get summary statistics of SMS replies
 *
 * Response:
 * {
 *   "success": true,
 *   "summary": {
 *     "total": number,
 *     "yes": number,
 *     "no": number,
 *     "processed": number,
 *     "pending": number
 *   }
 * }
 */
router.get("/summary", async (req, res) => {
  try {
    const summary = await getRepliesSummary();

    res.json({
      success: true,
      summary: summary,
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch summary",
    });
  }
});

export default router;
