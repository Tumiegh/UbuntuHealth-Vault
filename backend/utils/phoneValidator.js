/**
 * Phone number validation utility for South African phone numbers
 * Ensures numbers are in the format +27XXXXXXXXXX (E.164 format)
 */

/**
 * Validates if a phone number is in the correct E.164 format (+27XXXXXXXXXX)
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidSouthAfricanNumber = (phoneNumber) => {
  // Pattern for South African numbers: +27 followed by 9 digits
  const pattern = /^\+27\d{9}$/;
  return pattern.test(phoneNumber);
};

/**
 * Formats a phone number to E.164 format
 * Handles various input formats and converts them to +27XXXXXXXXXX
 * @param {string} phoneNumber - The raw phone number
 * @returns {string|null} - Formatted number or null if invalid
 */
export const formatPhoneNumber = (phoneNumber) => {
  // Remove all whitespace
  let cleaned = phoneNumber.trim().replace(/\s+/g, "");

  // If it starts with 0, replace with +27
  if (cleaned.startsWith("0")) {
    cleaned = "+27" + cleaned.slice(1);
  }

  // If it doesn't start with +, add it
  if (!cleaned.startsWith("+")) {
    // Assume it's a South African number starting with 27
    if (cleaned.startsWith("27")) {
      cleaned = "+" + cleaned;
    } else {
      cleaned = "+27" + cleaned;
    }
  }

  // Validate the formatted number
  if (isValidSouthAfricanNumber(cleaned)) {
    return cleaned;
  }

  return null;
};
