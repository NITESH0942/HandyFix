import { Vonage } from '@vonage/server-sdk';

// Initialize Vonage client for SMS (only if credentials are provided)
let vonageSMS = null;
if (process.env.VONAGE_API_KEY && process.env.VONAGE_API_SECRET) {
  try {
    vonageSMS = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
    });
  } catch (error) {
    console.warn('Vonage SMS initialization failed:', error.message);
  }
}

// Initialize Vonage client for Messages API (WhatsApp)
// For Messages API, we can use the same client but with JWT auth if needed
let vonageMessages = null;
if (process.env.VONAGE_APPLICATION_ID && process.env.VONAGE_PRIVATE_KEY) {
  try {
    // For Messages API, initialize with application credentials
    vonageMessages = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
      applicationId: process.env.VONAGE_APPLICATION_ID,
      privateKey: process.env.VONAGE_PRIVATE_KEY,
    });
  } catch (error) {
    console.warn('Vonage Messages API initialization failed:', error.message);
  }
}

/**
 * Send OTP via WhatsApp using Vonage Messages API
 * @param {string} mobileNumber - Mobile number in E.164 format (e.g., 919876543210)
 * @param {string} otp - The OTP code to send
 * @returns {Promise<Object>} - Response from Vonage API
 */
export const sendOTPViaWhatsApp = async (mobileNumber, otp) => {
  try {
    // Format mobile number to E.164 format (add country code if not present)
    // Assuming Indian numbers (91) - adjust based on your needs
    let formattedNumber = mobileNumber;
    if (!mobileNumber.startsWith('+')) {
      // If it's a 10-digit number, assume it's Indian and add +91
      if (mobileNumber.length === 10) {
        formattedNumber = `91${mobileNumber}`;
      }
      formattedNumber = `+${formattedNumber}`;
    }

    // Check if Messages API is configured
    if (!vonageMessages) {
      throw new Error('Vonage Messages API not configured. Please set VONAGE_APPLICATION_ID and VONAGE_PRIVATE_KEY');
    }

    // WhatsApp message content
    const message = `Your OTP for Home Service is: ${otp}. This OTP is valid for 10 minutes. Please do not share this OTP with anyone.`;

    const fromNumber = process.env.VONAGE_WHATSAPP_NUMBER || process.env.VONAGE_FROM_NUMBER;
    if (!fromNumber) {
      throw new Error('VONAGE_WHATSAPP_NUMBER or VONAGE_FROM_NUMBER is not set');
    }

    // Send via Vonage Messages API (WhatsApp)
    const response = await vonageMessages.messages.send({
      channel: 'whatsapp',
      message_type: 'text',
      to: formattedNumber,
      from: fromNumber,
      text: message,
    });

    return {
      success: true,
      messageId: response.message_uuid || response.messageId,
      response,
    };
  } catch (error) {
    console.error('Vonage WhatsApp API Error:', error);
    throw error;
  }
};

/**
 * Send OTP via SMS using Vonage (fallback option)
 * @param {string} mobileNumber - Mobile number in E.164 format
 * @param {string} otp - The OTP code to send
 * @returns {Promise<Object>} - Response from Vonage API
 */
export const sendOTPViaSMS = async (mobileNumber, otp) => {
  try {
    if (!vonageSMS) {
      throw new Error('Vonage SMS service not configured. Please set VONAGE_API_KEY and VONAGE_API_SECRET');
    }

    // Format mobile number to E.164 format
    let formattedNumber = mobileNumber;
    if (!mobileNumber.startsWith('+')) {
      if (mobileNumber.length === 10) {
        formattedNumber = `91${mobileNumber}`;
      }
      formattedNumber = `+${formattedNumber}`;
    }

    const message = `Your OTP for Home Service is: ${otp}. This OTP is valid for 10 minutes. Please do not share this OTP with anyone.`;

    const fromNumber = process.env.VONAGE_FROM_NUMBER || 'Vonage';
    
    const response = await vonageSMS.sms.send({
      to: formattedNumber,
      from: fromNumber,
      text: message,
    });

    // Check if message was sent successfully
    if (response.messages && response.messages[0].status === '0') {
      return {
        success: true,
        messageId: response.messages[0]['message-id'],
        response,
      };
    } else {
      throw new Error(response.messages?.[0]?.['error-text'] || 'Failed to send SMS');
    }
  } catch (error) {
    console.error('Vonage SMS API Error:', error);
    throw error;
  }
};

