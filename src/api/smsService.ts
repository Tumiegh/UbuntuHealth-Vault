/**
 * SMS Service - Frontend Client
 * Communicates with the backend API to fetch SMS replies
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Fetches all SMS replies from the backend
 * @param {Object} options - Filter options
 * @param {string} options.response - Filter by response type (YES/NO)
 * @param {string} options.phoneNumber - Filter by phone number
 * @param {boolean} options.processed - Filter by processed status
 * @returns {Promise<Object>} - API response containing replies
 * @throws {Error} - If the API request fails
 */
export const fetchSMSReplies = async (options: {
  response?: string;
  phoneNumber?: string;
  processed?: boolean;
} = {}) => {
  const params = new URLSearchParams();

  if (options.response) {
    params.append("response", options.response);
  }
  if (options.phoneNumber) {
    params.append("phoneNumber", options.phoneNumber);
  }
  if (options.processed !== undefined) {
    params.append("processed", String(options.processed));
  }

  const queryString = params.toString();
  const url = `${API_URL}/api/sms/replies${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch SMS replies");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching SMS replies:", error);
    throw error;
  }
};

/**
 * Fetches a specific SMS reply by message ID
 * @param {string} messageId - The message ID
 * @returns {Promise<Object>} - API response containing the reply
 * @throws {Error} - If the API request fails
 */
export const getSMSReplyById = async (messageId: string) => {
  const response = await fetch(`${API_URL}/api/sms/replies/${messageId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch SMS reply");
  }

  return response.json();
};

/**
 * Marks a reply as processed
 * @param {string} messageId - The message ID to mark
 * @returns {Promise<Object>} - API response
 * @throws {Error} - If the API request fails
 */
export const markSMSReplyAsProcessed = async (messageId: string) => {
  const response = await fetch(`${API_URL}/api/sms/replies/${messageId}/mark-processed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to mark reply as processed");
  }

  return response.json();
};

/**
 * Fetches SMS summary statistics
 * @returns {Promise<Object>} - API response containing summary data
 * @throws {Error} - If the API request fails
 */
export const fetchSMSSummary = async () => {
  const response = await fetch(`${API_URL}/api/sms/summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch SMS summary");
  }

  return response.json();
};

/**
 * Sends a confirmation SMS to a patient
 * @param {string} phoneNumber - Patient phone number
 * @param {string} patientName - Patient's full name
 * @param {string} response - Patient's response (YES or NO)
 * @returns {Promise<Object>} - API response
 * @throws {Error} - If the API request fails
 */
export const sendConfirmationSMS = async (
  phoneNumber: string,
  patientName: string,
  response: string
) => {
  const res = await fetch(`${API_URL}/api/sms/send-confirmation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phoneNumber,
      patientName,
      response,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to send confirmation SMS");
  }

  return res.json();
};
