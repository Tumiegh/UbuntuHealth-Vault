# Testing with Africa's Talking Sandbox - Step by Step

## Prerequisites

1. Africa's Talking account (free sandbox available)
2. ngrok installed (for exposing local server)
3. Your backend running on port 3000

---

## Step 1: Get Your Sandbox Credentials

### A. Create Africa's Talking Account

1. Go to https://africastalking.com/
2. Click **"Get Started"** or **"Sign Up"**
3. Fill in your details and verify email
4. Log in to your dashboard

### B. Get Your API Key and Username

1. In Africa's Talking dashboard, go to **Settings** or **API Keys**
2. You'll see:
   - **Username**: Usually `sandbox` for testing (or your account username)
   - **API Key**: A long alphanumeric string

3. Copy both values

---

## Step 2: Configure Your Environment

### Update .env File

In `backend/.env`, add/update:

```env
AFRICAS_TALKING_API_KEY=your_actual_api_key_from_dashboard
AFRICAS_TALKING_USERNAME=sandbox
SMS_WEBHOOK_URL=https://your-ngrok-url.ngrok.io/api/sms/callback
```

**Important**: Don't commit real API keys to git! Keep them in `.env` which is in `.gitignore`

---

## Step 3: Set Up ngrok for Local Testing

Africa's Talking needs to reach your local server. Use ngrok to create a public tunnel.

### A. Download and Install ngrok

Visit: https://ngrok.com/download

Choose your OS and extract it.

### B. Start ngrok

Open a new terminal and run:

```bash
# On Windows
ngrok.exe http 3000

# On Mac/Linux
ngrok http 3000
```

You'll see output like:

```
ngrok by @inconshreveable                                                    (Ctrl+C to quit)
                                                                             
Session Status                online
Account                       your-email@example.com (Plan: Free)
Version                       3.3.1
Region                        United States (us)
Forwarding                    https://abc123def456.ngrok.io -> http://localhost:3000
Forwarding                    http://abc123def456.789io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p75
                              0       0       0.00    0.00    0.00    0.00
```

**Copy the HTTPS URL**: `https://abc123def456.ngrok.io`

### C. Update Your .env File

```env
SMS_WEBHOOK_URL=https://abc123def456.ngrok.io/api/sms/callback
```

---

## Step 4: Configure Webhook in Africa's Talking Dashboard

### A. Navigate to Webhook Settings

1. Log in to https://africastalking.com/dashboard
2. Go to **SMS** section
3. Look for **"Webhooks"**, **"Incoming Messages"**, or **"Callback URL"**
4. Find the section for **SMS Delivery Reports** or **Incoming SMS**

### B. Add Your Webhook URL

Set the callback URL to:

```
https://abc123def456.ngrok.io/api/sms/callback
```

Replace `abc123def456` with your actual ngrok URL.

### C. Save Configuration

- Make sure it's set to **POST** method
- Ensure **JSON** format is selected
- Save/Update

---

## Step 5: Start Your Backend Server

In a new terminal:

```bash
cd backend
bun install  # First time only
bun run dev
```

You should see:

```
[08:30:45] watching...
╔══════════════════════════════════════════════════════╗
║  Ubuntu Health Vault Backend                         ║
║  Server running on http://localhost:3000             ║
║  Frontend: http://localhost:5173                     ║
║  Environment: development                            ║
╚══════════════════════════════════════════════════════╝
```

---

## Step 6: Test Sending SMS via Sandbox

### Option A: Use Africa's Talking Dashboard Sandbox Console

1. In Africa's Talking dashboard, find **SMS** → **Sandbox**
2. You'll see a test console
3. Enter:
   - **To**: A test phone number (e.g., `+27712345678`)
   - **Message**: Your test message
4. Send it

### Option B: Test via Your Backend API

First, test that your SMS sending works:

```bash
curl -X POST http://localhost:3000/api/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Test Patient",
    "phoneNumber": "+27712345678",
    "idNumber": "1234567890"
  }'
```

---

## Step 7: Simulate Patient Reply from Sandbox

### In Africa's Talking Sandbox Dashboard

1. Go to **SMS** → **Sandbox Console**
2. Look for **"Send Message as if from a number"** or **"Reply"** section
3. Select the test number you used (e.g., `+27712345678`)
4. Type: `YES` or `NO`
5. Send it

This simulates a patient replying to your SMS.

### Africa's Talking will now:

1. Call your webhook: `https://your-ngrok-url.ngrok.io/api/sms/callback`
2. Your backend will receive and process the reply
3. It gets stored in `backend/data/sms_replies.json`

---

## Step 8: Verify Reply Was Received

### Check Backend Logs

Look at your backend terminal. You should see:

```
[SMS Reply] Phone: +27712345678 | Response: YES | ID: ATXid_1234567890
Reply saved to C:\Users\...\backend\data\sms_replies.json
[Webhook] Incoming SMS callback: { from: '+27712345678', text: 'YES', ... }
```

### Query Your API

```bash
# Get all replies
curl http://localhost:3000/api/sms/replies

# Get YES replies only
curl "http://localhost:3000/api/sms/replies?response=YES"

# Get summary statistics
curl http://localhost:3000/api/sms/summary
```

Expected response:

```json
{
  "success": true,
  "count": 1,
  "replies": [
    {
      "id": "ATXid_1234567890",
      "phoneNumber": "+27712345678",
      "response": "YES",
      "rawText": "YES",
      "timestamp": "2026-01-23T10:30:00Z",
      "linkId": null,
      "processed": false,
      "processedAt": null
    }
  ]
}
```

### Check the Data File

```bash
# On Windows
type backend\data\sms_replies.json

# On Mac/Linux
cat backend/data/sms_replies.json
```

You'll see your stored replies.

---

## Complete Testing Workflow

```bash
# Terminal 1: Start backend
cd backend
bun run dev

# Terminal 2: Start ngrok
ngrok http 3000
# Copy the URL: https://abc123def456.ngrok.io

# Terminal 3: Update .env with ngrok URL
# Then update Africa's Talking webhook settings

# Terminal 4: Send test SMS
curl -X POST http://localhost:3000/api/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "phoneNumber": "+27712345678",
    "idNumber": "1234567890"
  }'

# In Africa's Talking Dashboard: 
# - Use Sandbox console to reply "YES" to the number

# Terminal 4: Check replies
curl http://localhost:3000/api/sms/replies

# You should see your YES response!
```

---

## Troubleshooting

### Webhook Not Being Called

**Problem**: Africa's Talking isn't calling your webhook

**Solution**:
1. Verify ngrok URL is correct in Africa's Talking settings
2. Check ngrok console for incoming requests (you'll see `POST /api/sms/callback`)
3. Ensure your backend is running
4. Check backend logs for errors

### Getting "Invalid Response" Error

**Problem**: Your reply isn't being recognized as YES/NO

**Solution**:
- Ensure you're sending exactly `YES` or `NO` (case-insensitive, but no extra spaces)
- Check `rawText` field in stored reply to see what was actually sent

### ngrok URL Keeps Changing

**Problem**: You restart ngrok and get a new URL

**Solution**:
- Upgrade to ngrok Pro for a permanent URL
- OR update Africa's Talking webhook URL each time you restart ngrok
- OR use the terminal ID to keep the same session

### Can't Connect to Africa's Talking

**Problem**: API key not working or connection refused

**Solution**:
1. Double-check API key is copied correctly (no spaces)
2. Ensure you're using `sandbox` as username for testing
3. Check internet connection
4. Verify you're using correct environment (sandbox vs production)

---

## Next: Move to Production (Later)

When ready to go live:

1. Switch from `sandbox` username to your actual account username
2. Use your production API key
3. Deploy backend to a real server (AWS, Heroku, etc.)
4. Update Africa's Talking webhook to your production URL
5. Remove ngrok and use your domain directly

---

## Pro Tips

- **Keep ngrok running**: Don't close the ngrok terminal while testing
- **Check ngrok Web UI**: Open http://127.0.0.1:4040 to see all webhook calls in real-time
- **Test with different numbers**: Africa's Talking sandbox lets you test with multiple phone numbers
- **Check Africa's Talking docs**: https://africastalking.com/sms/api for detailed API docs
- **Monitor API usage**: Africa's Talking dashboard shows all SMS sent/received

---

## Test Checklist

- [ ] Africa's Talking account created
- [ ] API key and username copied
- [ ] .env file updated with credentials
- [ ] ngrok installed and running
- [ ] ngrok URL configured in Africa's Talking
- [ ] Backend server running
- [ ] Test SMS sent via checkin API
- [ ] Reply simulated in Africa's Talking sandbox
- [ ] Reply received in backend logs
- [ ] Reply visible in `/api/sms/replies` endpoint
- [ ] Data file created at `backend/data/sms_replies.json`

✅ All checked? You're ready to use the SMS reply system!
