# Step-by-Step Guide: How to Get Vonage Credentials

This guide will walk you through getting all the Vonage credentials needed for sending OTP via WhatsApp and SMS.

## Step 1: Create a Vonage Account

1. Go to [Vonage Dashboard](https://dashboard.nexmo.com/sign-up)
2. Click **"Sign Up"** and create a free account
3. Verify your email address
4. Log in to your dashboard

## Step 2: Get API Key and Secret (For SMS)

1. After logging in, you'll see your dashboard
2. Go to **Settings** (top right corner) → **API Credentials**
3. You'll see:
   - **API Key** (looks like: `a1b2c3d4`)
   - **API Secret** (looks like: `e5f6g7h8i9j0`)
4. Copy both values

**Add to .env:**
```env
VONAGE_API_KEY=a1b2c3d4
VONAGE_API_SECRET=e5f6g7h8i9j0
```

## Step 3: Get a Virtual Number (For SMS Fallback)

1. In the dashboard, go to **Numbers** → **Buy Numbers**
2. Select your country (e.g., India, USA)
3. Choose a number and click **"Buy"**
4. Copy the number (it will be in E.164 format like `+1234567890`)

**Add to .env:**
```env
VONAGE_FROM_NUMBER=+1234567890
```

## Step 4: Create an Application (For WhatsApp)

1. In the dashboard, go to **Applications** → **Create new application**
2. Fill in:
   - **Application name**: e.g., "Home Service OTP"
   - **Capabilities**: Check **"Messages"**
   - **Public Key**: You can generate one or leave default
3. Click **"Generate public/private key pair"** if needed
4. Click **"Create Application"**
5. After creation, you'll see:
   - **Application ID** (looks like: `12345678-abcd-1234-abcd-123456789abc`)
   - **Private Key** (download button available)

**Add to .env:**
```env
VONAGE_APPLICATION_ID=12345678-abcd-1234-abcd-123456789abc
```

## Step 5: Get Private Key (For WhatsApp)

1. In your application details page, click **"Download"** next to Private Key
2. This downloads a `.key` file
3. You have two options:

### Option A: Copy the key content as a string
1. Open the `.key` file in a text editor
2. Copy the entire content (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
3. Paste it directly in `.env` (keep it on one line or use `\n` for newlines)

**Add to .env:**
```env
VONAGE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----"
```

### Option B: Use file path (Alternative)
If you prefer to keep the key in a file:
1. Save the `.key` file in your `server` directory (e.g., `server/vonage-private.key`)
2. Update the code to read from file path instead

## Step 6: Set Up WhatsApp Business Number

**Important:** WhatsApp messaging requires additional setup and approval.

1. Go to **Messages** → **WhatsApp** in the dashboard
2. You need to:
   - Register your WhatsApp Business Account
   - Get approval from Vonage
   - Link your WhatsApp Business number
3. Once approved, you'll get a WhatsApp number (format: `14155552671` or similar)

**Add to .env:**
```env
VONAGE_WHATSAPP_NUMBER=14155552671
```

**Note:** If you don't have WhatsApp set up yet, the system will automatically fall back to SMS.

## Step 7: Create Your .env File

1. In the `server` directory, create a file named `.env` (not `.env.example`)
2. Copy the content from `.env.example`
3. Replace all placeholder values with your actual credentials

**Example .env file:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/home-service

# JWT Secret
JWT_SECRET=my_super_secret_jwt_key_12345

# Vonage API Credentials
VONAGE_API_KEY=a1b2c3d4
VONAGE_API_SECRET=e5f6g7h8i9j0

# Vonage WhatsApp
VONAGE_APPLICATION_ID=12345678-abcd-1234-abcd-123456789abc
VONAGE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----"
VONAGE_WHATSAPP_NUMBER=14155552671

# Vonage SMS
VONAGE_FROM_NUMBER=+1234567890
```

## Step 8: Test Your Configuration

1. Make sure your `.env` file is in the `server` directory
2. Start your server:
   ```bash
   cd server
   npm run dev
   ```
3. Test the OTP endpoint:
   ```bash
   POST http://localhost:5000/api/auth/send-otp
   Body: { "mobile": "9876543210" }
   ```
4. Check your WhatsApp/SMS for the OTP

## Troubleshooting

### "Vonage Messages API not configured"
- Make sure `VONAGE_APPLICATION_ID` and `VONAGE_PRIVATE_KEY` are set
- Check that the private key is properly formatted (with quotes if it contains newlines)

### "Failed to send OTP"
- Verify your API key and secret are correct
- Check that you have sufficient credits in your Vonage account
- For WhatsApp: Ensure your WhatsApp Business account is approved
- For SMS: Verify your virtual number is active

### Private Key Format Issues
- If using a multi-line private key, wrap it in quotes: `"-----BEGIN...-----"`
- Or use `\n` for newlines: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"`

## Quick Start (SMS Only - No WhatsApp)

If you only want to use SMS (no WhatsApp), you only need:

```env
VONAGE_API_KEY=your_api_key
VONAGE_API_SECRET=your_api_secret
VONAGE_FROM_NUMBER=+1234567890
```

The system will automatically use SMS if WhatsApp is not configured.

## Additional Resources

- [Vonage Dashboard](https://dashboard.nexmo.com/)
- [Vonage Getting Started Guide](https://developer.vonage.com/getting-started)
- [Vonage WhatsApp Setup](https://developer.vonage.com/messages/concepts/whatsapp)
- [Vonage SMS Documentation](https://developer.vonage.com/messaging/sms/overview)


