# Vonage (Nexmo) WhatsApp/SMS Setup Guide

This guide explains how to configure Vonage (formerly Nexmo) to send OTP messages via WhatsApp and SMS.

## Environment Variables Required

Add the following environment variables to your `.env` file in the `server` directory:

```env
# Vonage API Credentials
VONAGE_API_KEY=your_api_key_here
VONAGE_API_SECRET=your_api_secret_here

# For WhatsApp Messages API (optional, if using WhatsApp)
VONAGE_APPLICATION_ID=your_application_id_here
VONAGE_PRIVATE_KEY=your_private_key_here
VONAGE_WHATSAPP_NUMBER=your_whatsapp_number_here

# For SMS (fallback option)
VONAGE_FROM_NUMBER=your_vonage_virtual_number_here
```

## Getting Vonage Credentials

### 1. Create a Vonage Account
- Go to [Vonage Dashboard](https://dashboard.nexmo.com/)
- Sign up for a free account

### 2. Get API Key and Secret
- After logging in, go to **Settings** → **API Credentials**
- Copy your **API Key** and **API Secret**

### 3. For WhatsApp Messages API
- Go to **Applications** in the dashboard
- Create a new application or use an existing one
- Copy the **Application ID**
- Download the **Private Key** file and convert it to a string (or use the key path)
- Note: WhatsApp messaging requires approval from Vonage and may have additional setup steps

### 4. For SMS (Fallback)
- Go to **Numbers** → **Buy Numbers** or use your existing virtual number
- Copy the number (in E.164 format, e.g., `+1234567890`)

## Configuration Notes

1. **WhatsApp vs SMS**: The code tries WhatsApp first, then falls back to SMS if WhatsApp fails.

2. **Mobile Number Format**: 
   - The code automatically formats 10-digit Indian numbers to include country code (+91)
   - For other countries, ensure numbers are in E.164 format (e.g., `+1234567890`)

3. **Development Mode**: 
   - In development, OTPs are also logged to console if sending fails
   - Remove this in production

## Testing

1. Make sure all environment variables are set
2. Start your server: `npm run dev` (in the server directory)
3. Test the endpoint: `POST /api/auth/send-otp` with body `{ "mobile": "9876543210" }`
4. Check your WhatsApp/SMS for the OTP

## Troubleshooting

- **WhatsApp not working**: Ensure your Vonage account has WhatsApp messaging enabled and approved
- **SMS not working**: Check that your virtual number is active and has sufficient credits
- **Authentication errors**: Verify your API key and secret are correct
- **Number format errors**: Ensure mobile numbers are in the correct format

## Additional Resources

- [Vonage Messages API Documentation](https://developer.vonage.com/messages/overview)
- [Vonage WhatsApp API Guide](https://developer.vonage.com/messages/concepts/whatsapp)
- [Vonage SMS API Documentation](https://developer.vonage.com/messaging/sms/overview)


