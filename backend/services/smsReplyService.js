/**
 * SMS Reply Handler Service
 * Processes incoming SMS replies from Africa's Talking sandbox
 * Handles YES/NO responses from patients regarding medical record access
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../data");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Process incoming SMS reply from Africa's Talking webhook
 * Expected webhook payload:
 * {
 *   "from": "+254XXXXXXXXX",
 *   "text": "YES|NO",
 *   "id": "message_id",
 *   "date": "2026-01-23T10:30:00Z",
 *   "linkId": "link_id"
 * }
 *
 * @param {Object} payload - The webhook payload from Africa's Talking
 * @returns {Promise<Object>} - Processing result with status and details
 */
export const handleSMSReply = async (payload) => {
  try {
    const { from, text, id, date, linkId } = payload;

    // Validate required fields
    if (!from || !text) {
      console.error("❌ Validation failed - Missing fields. From:", from, "Text:", text);
      return {
        success: false,
        error: "Missing required fields (from, text)",
      };
    }

    console.log(`📨 Processing reply from ${from}: "${text}"`);

    // Normalize the response
    const response = text.trim().toUpperCase();

    // Validate YES/NO response
    if (!["YES", "NO"].includes(response)) {
      console.error(`❌ Invalid response format: "${text}". Expected YES or NO.`);
      return {
        success: false,
        error: `Invalid response: "${text}". Expected YES or NO.`,
      };
    }

    console.log(`✓ Valid response: ${response}`);

    // Create reply record
    const replyRecord = {
      id: id || generateMessageId(),
      phoneNumber: from,
      response: response,
      rawText: text,
      timestamp: date || new Date().toISOString(),
      linkId: linkId || null,
      processed: false,
      processedAt: null,
    };

    console.log(`💾 Saving reply record...`);

    // Save reply to file-based storage
    await saveReplyRecord(replyRecord);

    console.log(`✓ Reply saved successfully`);

    // Log the response
    console.log(
      `[SMS Reply] Phone: ${from} | Response: ${response} | ID: ${id}`
    );

    return {
      success: true,
      message: "Reply processed successfully",
      response: response,
      phoneNumber: from,
      messageId: id,
    };
  } catch (error) {
    console.error("Error processing SMS reply:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Save SMS reply record to file system
 * @param {Object} replyRecord - The reply record to save
 */
export const saveReplyRecord = async (replyRecord) => {
  const filePath = path.join(dataDir, "sms_replies.json");

  try {
    let replies = [];

    // Read existing replies if file exists
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      replies = JSON.parse(data);
    }

    // Add new reply
    replies.push(replyRecord);

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(replies, null, 2));

    console.log(`Reply saved to ${filePath}`);
  } catch (error) {
    console.error("Error saving reply record:", error);
    throw error;
  }
};

/**
 * Get all SMS replies
 * @param {Object} options - Filter options
 * @returns {Promise<Array>} - Array of reply records
 */
export const getAllReplies = async (options = {}) => {
  const filePath = path.join(dataDir, "sms_replies.json");

  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const data = fs.readFileSync(filePath, "utf-8");
    let replies = JSON.parse(data);

    // Apply filters if provided
    if (options.response) {
      replies = replies.filter((r) => r.response === options.response);
    }

    if (options.phoneNumber) {
      replies = replies.filter((r) => r.phoneNumber === options.phoneNumber);
    }

    if (options.processed !== undefined) {
      replies = replies.filter((r) => r.processed === options.processed);
    }

    return replies;
  } catch (error) {
    console.error("Error reading replies:", error);
    return [];
  }
};

/**
 * Get reply by message ID
 * @param {string} messageId - The message ID
 * @returns {Promise<Object|null>} - Reply record or null if not found
 */
export const getReplyById = async (messageId) => {
  const filePath = path.join(dataDir, "sms_replies.json");

  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const data = fs.readFileSync(filePath, "utf-8");
    const replies = JSON.parse(data);

    return replies.find((r) => r.id === messageId) || null;
  } catch (error) {
    console.error("Error reading reply:", error);
    return null;
  }
};

/**
 * Mark reply as processed
 * @param {string} messageId - The message ID to mark
 * @returns {Promise<boolean>} - Success status
 */
export const markReplyAsProcessed = async (messageId) => {
  const filePath = path.join(dataDir, "sms_replies.json");

  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    const data = fs.readFileSync(filePath, "utf-8");
    let replies = JSON.parse(data);

    const replyIndex = replies.findIndex((r) => r.id === messageId);
    if (replyIndex === -1) {
      return false;
    }

    replies[replyIndex].processed = true;
    replies[replyIndex].processedAt = new Date().toISOString();

    fs.writeFileSync(filePath, JSON.stringify(replies, null, 2));

    console.log(`Reply ${messageId} marked as processed`);
    return true;
  } catch (error) {
    console.error("Error marking reply as processed:", error);
    return false;
  }
};

/**
 * Get summary statistics of SMS replies
 * @returns {Promise<Object>} - Statistics object
 */
export const getRepliesSummary = async () => {
  const filePath = path.join(dataDir, "sms_replies.json");

  try {
    if (!fs.existsSync(filePath)) {
      return {
        total: 0,
        yes: 0,
        no: 0,
        processed: 0,
        pending: 0,
      };
    }

    const data = fs.readFileSync(filePath, "utf-8");
    const replies = JSON.parse(data);

    return {
      total: replies.length,
      yes: replies.filter((r) => r.response === "YES").length,
      no: replies.filter((r) => r.response === "NO").length,
      processed: replies.filter((r) => r.processed).length,
      pending: replies.filter((r) => !r.processed).length,
    };
  } catch (error) {
    console.error("Error calculating summary:", error);
    return {
      total: 0,
      yes: 0,
      no: 0,
      processed: 0,
      pending: 0,
    };
  }
};

/**
 * Generate a unique message ID
 * @returns {string} - Generated ID
 */
function generateMessageId() {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
