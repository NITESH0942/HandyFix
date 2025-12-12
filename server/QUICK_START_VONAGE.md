# Quick Start: Adding Vonage Credentials to .env

Your `.env` file already exists in the `server` directory. Follow these steps to add Vonage credentials:

## Option 1: SMS Only (Simplest - Recommended to Start)

If you just want to test with SMS first, add these 3 lines to your `.env` file:

```env
VONAGE_API_KEY=your_api_key_here
VONAGE_API_SECRET=your_api_secret_here
VONAGE_FROM_NUMBER=+1234567890
```

### How to Get These:

1. **API Key & Secret:**
   - Go to https://dashboard.nexmo.com/
   - Login → Settings → API Credentials
   - Copy **API Key** and **API Secret**

2. **Virtual Number:**
   - In dashboard → **Numbers** → **Buy Numbers**
   - Select country → Buy a number
   - Copy the number (format: `+1234567890`)

## Option 2: WhatsApp + SMS (Full Setup)

Add all these lines to your `.env` file:

```env
# Basic SMS (Required)
VONAGE_API_KEY=your_api_key_here
VONAGE_API_SECRET=your_api_secret_here
VONAGE_FROM_NUMBER=+1234567890

# WhatsApp (Optional - requires approval)
VONAGE_APPLICATION_ID=your_application_id_here
VONAGE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_CONTENT\n-----END PRIVATE KEY-----"
VONAGE_WHATSAPP_NUMBER=14155552671
```

### How to Get WhatsApp Credentials:

1. **Application ID & Private Key:**
   - Dashboard → **Applications** → **Create new application**
   - Name it (e.g., "Home Service OTP")
   - Enable **"Messages"** capability
   - Click **"Generate key pair"** if needed
   - After creation, copy **Application ID**
   - Download **Private Key** file
   - Open the `.key` file and copy its content
   - Paste in `.env` with quotes: `VONAGE_PRIVATE_KEY="-----BEGIN...-----"`

2. **WhatsApp Number:**
   - Dashboard → **Messages** → **WhatsApp**
   - Complete WhatsApp Business setup (requires approval)
   - Once approved, you'll get a WhatsApp number

## Example .env File

Here's what your complete `.env` file should look like:

```env
# Your existing variables...
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/home-service
JWT_SECRET=your_jwt_secret

# Add these Vonage credentials:
VONAGE_API_KEY=a1b2c3d4e5f6
VONAGE_API_SECRET=g7h8i9j0k1l2m3n4o5p6
VONAGE_FROM_NUMBER=+1234567890

# Optional - for WhatsApp:
VONAGE_APPLICATION_ID=12345678-abcd-1234-abcd-123456789abc
VONAGE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----"
VONAGE_WHATSAPP_NUMBER=14155552671
```

## Important Notes

1. **No spaces** around the `=` sign: `VONAGE_API_KEY=value` ✅ (not `VONAGE_API_KEY = value` ❌)

2. **Private Key Format:**
   - If multi-line, wrap in quotes: `VONAGE_PRIVATE_KEY="-----BEGIN...-----"`
   - Or use `\n` for newlines: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"`

3. **Phone Number Format:**
   - Must include country code: `+919876543210` (not `9876543210`)
   - Or just `+1234567890` for other countries

4. **Test First:**
   - Start with SMS only (Option 1)
   - Once working, add WhatsApp (Option 2)

## Testing

After adding credentials:

1. Restart your server:
   ```bash
   cd server
   npm run dev
   ```

2. Test the endpoint:
   ```bash
   POST http://localhost:5000/api/auth/send-otp
   Body: { "mobile": "9876543210" }
   ```

3. Check your phone for the OTP!

## Need More Help?

- See `VONAGE_CREDENTIALS_GUIDE.md` for detailed step-by-step instructions
- See `VONAGE_SETUP.md` for troubleshooting


