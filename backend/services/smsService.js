/**
 * Africa's Talking SMS Service
 * Handles all SMS sending operations using Africa's Talking API
 */

import AfricasTalking from "africastalking";

// Initialize Africa's Talking with environment credentials
const { SMS } = AfricasTalking({
  apiKey: process.env.AFRICAS_TALKING_API_KEY,
  username: process.env.AFRICAS_TALKING_USERNAME,
});

/**
 * Sends an SMS access request to a patient
 * The SMS contains instructions for the patient to grant medical record access
 * @param {string} phoneNumber - Patient phone number in E.164 format (+27XXXXXXXXXX)
 * @param {string} patientName - Patient's full name
 * @returns {Promise<Object>} - API response with message status
 * @throws {Error} - If SMS sending fails
 */
export const sendAccessRequestSMS = async (phoneNumber, patientName) => {
  try {
    const message = `Hi ${patientName}, your clinic has requested access to your medical records. Reply YES to grant access or NO to deny.`;

    const sendOptions = {
      to: [phoneNumber],
      message: message,
    };

    // Add shortcode if configured in environment
    if (process.env.AFRICAS_TALKING_SHORTCODE) {
      sendOptions.from = process.env.AFRICAS_TALKING_SHORTCODE;
      console.log(`📤 Sending SMS from shortcode: ${process.env.AFRICAS_TALKING_SHORTCODE}`);
    }

    const result = await SMS.send(sendOptions);

    console.log("SMS sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to send SMS:", error);
    throw error;
  }
};

/**
 * Sends a reminder SMS to a patient with pending access request
 * @param {string} phoneNumber - Patient phone number in E.164 format (+27XXXXXXXXXX)
 * @param {string} patientName - Patient's full name
 * @returns {Promise<Object>} - API response with message status
 * @throws {Error} - If SMS sending fails
 */
export const sendReminderSMS = async (phoneNumber, patientName) => {
  try {
    const message = `Hi ${patientName}, reminder: your clinic is waiting for you to grant access to your medical records. Reply YES to grant access.`;

    const sendOptions = {
      to: [phoneNumber],
      message: message,
    };

    // Add shortcode if configured in environment
    if (process.env.AFRICAS_TALKING_SHORTCODE) {
      sendOptions.from = process.env.AFRICAS_TALKING_SHORTCODE;
      console.log(`📤 Sending reminder SMS from shortcode: ${process.env.AFRICAS_TALKING_SHORTCODE}`);
    }

    const result = await SMS.send(sendOptions);

    console.log("Reminder SMS sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to send reminder SMS:", error);
    throw error;
  }
};
