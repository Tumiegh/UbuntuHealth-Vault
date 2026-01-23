/**
 * Example Integration: Using SMS Replies in Your App
 * 
 * This file shows examples of how to use the SMS reply endpoints
 * in your application logic.
 */

// ============================================================================
// EXAMPLE 1: Check for Patient Responses
// ============================================================================

import { getAllReplies, getReplyById } from "./services/smsReplyService.js";

/**
 * Check if a patient has replied to an access request
 * @param {string} phoneNumber - Patient phone number
 * @returns {Promise<Object|null>} - Reply object or null
 */
async function checkPatientResponse(phoneNumber) {
  const replies = await getAllReplies({ phoneNumber: phoneNumber });

  if (replies.length === 0) {
    return { status: "pending", message: "No response yet" };
  }

  const latestReply = replies[replies.length - 1];
  return {
    status: "responded",
    response: latestReply.response,
    timestamp: latestReply.timestamp,
    processed: latestReply.processed,
  };
}

// Usage:
// const response = await checkPatientResponse("+27712345678");
// if (response.response === "YES") {
//   // Grant access to medical records
// } else if (response.response === "NO") {
//   // Deny access, send thank you SMS
// }

// ============================================================================
// EXAMPLE 2: Implement in Your Checkin Route
// ============================================================================

/**
 * Extended checkin endpoint that checks for existing responses
 */
export async function extendedCheckinEndpoint(req, res) {
  try {
    const { patientName, phoneNumber, idNumber } = req.body;

    // Check if patient has already responded
    const existingResponse = await getAllReplies({
      phoneNumber: phoneNumber,
    });

    if (existingResponse.length > 0) {
      const latestReply = existingResponse[existingResponse.length - 1];

      if (!latestReply.processed) {
        return res.status(200).json({
          success: true,
          message: "Patient has already responded to this request",
          response: latestReply.response,
          messageId: latestReply.id,
          timestamp: latestReply.timestamp,
        });
      }
    }

    // If no recent response, send new SMS request
    // ... rest of your checkin logic
  } catch (error) {
    console.error("Error in extended checkin:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// ============================================================================
// EXAMPLE 3: Process Unprocessed Replies
// ============================================================================

/**
 * Process all pending SMS replies (run this periodically or on demand)
 */
export async function processPendingReplies() {
  try {
    const pendingReplies = await getAllReplies({ processed: false });

    console.log(`Processing ${pendingReplies.length} pending replies...`);

    for (const reply of pendingReplies) {
      console.log(
        `\nProcessing reply from ${reply.phoneNumber}: ${reply.response}`
      );

      // YOUR BUSINESS LOGIC HERE
      if (reply.response === "YES") {
        console.log("✓ Granting access to medical records...");
        // TODO: Grant database access, create record access token, etc.

        // Send confirmation SMS
        // await sendConfirmationSMS(reply.phoneNumber, "access_granted");
      } else if (reply.response === "NO") {
        console.log("✗ Denying access to medical records...");
        // TODO: Log denial, update request status, etc.

        // Send thank you SMS
        // await sendConfirmationSMS(reply.phoneNumber, "access_denied");
      }

      // Mark as processed
      // await markReplyAsProcessed(reply.id);
    }
  } catch (error) {
    console.error("Error processing pending replies:", error);
  }
}

// ============================================================================
// EXAMPLE 4: API Endpoint to Get Current Responses
// ============================================================================

/**
 * Endpoint to check response status from frontend
 * GET /api/checkin/:phoneNumber/response-status
 */
export async function getResponseStatus(req, res) {
  try {
    const { phoneNumber } = req.params;
    const formattedPhone = decodeURIComponent(phoneNumber);

    const replies = await getAllReplies({ phoneNumber: formattedPhone });

    if (replies.length === 0) {
      return res.json({
        status: "pending",
        message: "Awaiting patient response",
        timestamp: null,
      });
    }

    const latestReply = replies[replies.length - 1];

    return res.json({
      status: "responded",
      response: latestReply.response,
      timestamp: latestReply.timestamp,
      processed: latestReply.processed,
      messageId: latestReply.id,
    });
  } catch (error) {
    console.error("Error getting response status:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// ============================================================================
// EXAMPLE 5: Batch Process Replies by Response Type
// ============================================================================

/**
 * Get analytics on response rates
 */
export async function getResponseAnalytics() {
  try {
    const yesReplies = await getAllReplies({ response: "YES" });
    const noReplies = await getAllReplies({ response: "NO" });

    const total = yesReplies.length + noReplies.length;
    const yesRate = total > 0 ? ((yesReplies.length / total) * 100).toFixed(1) : 0;

    return {
      total: total,
      approved: yesReplies.length,
      denied: noReplies.length,
      approvalRate: yesRate + "%",
      denialRate: (100 - yesRate) + "%",
    };
  } catch (error) {
    console.error("Error calculating analytics:", error);
    return null;
  }
}

// Usage:
// const analytics = await getResponseAnalytics();
// console.log(`Approval Rate: ${analytics.approvalRate}`);

// ============================================================================
// EXAMPLE 6: Scheduled Processing with Intervals
// ============================================================================

/**
 * Set up periodic processing of replies (call this in your server startup)
 */
export function startReplyProcessing(intervalMinutes = 5) {
  const intervalMs = intervalMinutes * 60 * 1000;

  console.log(
    `Starting SMS reply processor (checks every ${intervalMinutes} minutes)`
  );

  setInterval(async () => {
    try {
      await processPendingReplies();
    } catch (error) {
      console.error("Error in scheduled reply processing:", error);
    }
  }, intervalMs);
}

// In your server.js:
// import { startReplyProcessing } from "./config/replyProcessor.js";
// app.listen(PORT, () => {
//   startReplyProcessing(5); // Process every 5 minutes
// });

// ============================================================================
// EXAMPLE 7: Frontend Integration Example
// ============================================================================

/*
// Example React component that polls for responses

import { useEffect, useState } from "react";

export function CheckinResponsePoller({ phoneNumber }) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/checkin/${encodeURIComponent(phoneNumber)}/response-status`
        );
        const data = await res.json();
        
        if (data.status === "responded") {
          setResponse(data);
          clearInterval(interval); // Stop polling once we have a response
        }
      } catch (error) {
        console.error("Error checking response status:", error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [phoneNumber]);

  if (loading && !response) {
    return <div>Waiting for patient response...</div>;
  }

  if (response?.response === "YES") {
    return <div className="text-green-600">✓ Patient granted access</div>;
  }

  if (response?.response === "NO") {
    return <div className="text-red-600">✗ Patient denied access</div>;
  }

  return null;
}
*/
