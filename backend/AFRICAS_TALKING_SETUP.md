# Africa's Talking SMS Replies Setup Guide

This guide walks you through setting up SMS reply handling from the Africa's Talking sandbox API. Your application will receive YES/NO responses from patients and store them for processing.

## Quick Start

### 1. Environment Setup

Create a `.env` file in the `backend/` directory with your Africa's Talking credentials:

```env
AFRICAS_TALKING_API_KEY=your_api_key
AFRICAS_TALKING_USERNAME=sandbox
SMS_WEBHOOK_URL=http://localhost:3000/api/sms/callback
```

### 2. Start the Backend Server

```bash
cd backend
bun install
bun run dev
```

The server will start on `http://localhost:3000` with SMS webhook endpoints available.

---

## Testing the Setup Locally

### Option A: Using cURL (Direct Testing)

Test the webhook endpoint directly:

```bash
curl -X POST http://localhost:3000/api/sms/callback \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+27712345678",
    "text": "YES",
    "id": "ATXid_1234567890",
    "date": "2026-01-23T10:30:00Z"
  }'
```

### Option B: Using ngrok for Africa's Talking Callback (Recommended for Testing)

1. **Install ngrok** from https://ngrok.com/download

2. **Start your backend server:**
   ```bash
   cd backend
   bun run dev
   ```

3. **In a new terminal, expose your local server with ngrok:**
   ```bash
   ngrok http 3000
   ```

4. **Copy the ngrok URL** (looks like `https://abc123.ngrok.io`)

5. **Update your .env file:**
   ```env
   SMS_WEBHOOK_URL=https://abc123.ngrok.io/api/sms/callback
   ```

6. **Update Africa's Talking Webhook URL** (see Africa's Talking Setup section below)

---

## Africa's Talking Setup

### Getting Your API Key

1. Visit https://africastalking.com/
2. Sign up or log in to your account
3. Go to **Dashboard > API Keys**
4. Copy your **API Key** and **Username**

### Sandbox Testing

Africa's Talking provides a **sandbox** environment for testing:

- **Username:** `sandbox` (this is a test account)
- Use the sandbox to test SMS sending and receiving without charges
- Switch to production only when ready to go live

### Configure Webhook URL

1. Go to https://africastalking.com/dashboard
2. Navigate to **SMS > Webhooks** (or **Incoming Messages**)
3. Set the webhook URL to: `https://your-domain.com/api/sms/callback` (or your ngrok URL for testing)
4. Save the settings

The webhook should be configured for:
- **Incoming SMS Messages** (replies from users)
- **POST method**
- **JSON payload format**

---

## Available Endpoints

### Receive SMS Reply (Webhook from Africa's Talking)

**POST** `/api/sms/callback`

This endpoint receives SMS replies from Africa's Talking. It's automatically called when a patient replies to your SMS.

**Expected Payload:**
```json
{
  "from": "+27712345678",
  "text": "YES",
  "id": "ATXid_1234567890",
  "date": "2026-01-23T10:30:00Z",
  "linkId": "optional_link_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Callback processed successfully",
  "response": "YES",
  "phoneNumber": "+27712345678",
  "messageId": "ATXid_1234567890"
}
```

---

### Get All Replies

**GET** `/api/sms/replies`

Retrieve all SMS replies with optional filters.

**Query Parameters:**
- `response` - Filter by response (YES/NO)
- `phoneNumber` - Filter by phone number
- `processed` - Filter by processing status (true/false)

**Examples:**
```bash
# Get all replies
curl http://localhost:3000/api/sms/replies

# Get only YES responses
curl http://localhost:3000/api/sms/replies?response=YES

# Get only NO responses
curl http://localhost:3000/api/sms/replies?response=NO

# Get only unprocessed replies
curl http://localhost:3000/api/sms/replies?processed=false

# Get replies from specific phone number
curl http://localhost:3000/api/sms/replies?phoneNumber=%2B27712345678
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "replies": [
    {
      "id": "ATXid_1234567890",
      "phoneNumber": "+27712345678",
      "response": "YES",
      "rawText": "YES",
      "timestamp": "2026-01-23T10:30:00Z",
      "linkId": "optional_link_id",
      "processed": false,
      "processedAt": null
    },
    {
      "id": "ATXid_0987654321",
      "phoneNumber": "+27798765432",
      "response": "NO",
      "rawText": "NO",
      "timestamp": "2026-01-23T10:35:00Z",
      "linkId": "optional_link_id",
      "processed": false,
      "processedAt": null
    }
  ]
}
```

---

### Get Single Reply

**GET** `/api/sms/replies/:messageId`

Retrieve a specific reply by message ID.

**Example:**
```bash
curl http://localhost:3000/api/sms/replies/ATXid_1234567890
```

**Response:**
```json
{
  "success": true,
  "reply": {
    "id": "ATXid_1234567890",
    "phoneNumber": "+27712345678",
    "response": "YES",
    "rawText": "YES",
    "timestamp": "2026-01-23T10:30:00Z",
    "linkId": "optional_link_id",
    "processed": false,
    "processedAt": null
  }
}
```

---

### Mark Reply as Processed

**POST** `/api/sms/replies/:messageId/mark-processed`

Mark a reply as processed after you've handled it (e.g., after granting/denying access).

**Example:**
```bash
curl -X POST http://localhost:3000/api/sms/replies/ATXid_1234567890/mark-processed
```

**Response:**
```json
{
  "success": true,
  "message": "Reply marked as processed"
}
```

---

### Get Summary Statistics

**GET** `/api/sms/summary`

Get aggregate statistics about SMS replies.

**Example:**
```bash
curl http://localhost:3000/api/sms/summary
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "total": 10,
    "yes": 7,
    "no": 3,
    "processed": 5,
    "pending": 5
  }
}
```

---

## How the SMS Reply Flow Works

1. **Patient Receives SMS**: Your app sends an SMS to a patient asking "Reply YES to grant access or NO to deny"

2. **Patient Replies**: Patient sends back "YES" or "NO" via SMS

3. **Africa's Talking Webhook**: Africa's Talking calls your webhook endpoint with the reply

4. **Backend Processes Reply**: Your backend receives and processes the response:
   - Validates YES/NO format
   - Stores the reply in `backend/data/sms_replies.json`
   - Returns success to Africa's Talking

5. **Your App Handles Response**: 
   - Query `/api/sms/replies` to check for new responses
   - Grant or deny medical record access based on the response
   - Call `/api/sms/replies/:messageId/mark-processed` when done

---

## Testing Workflow

### Step 1: Send Access Request SMS

Use your existing endpoint to send an SMS:

```bash
curl -X POST http://localhost:3000/api/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "phoneNumber": "+27712345678",
    "idNumber": "1234567890"
  }'
```

### Step 2: Simulate Patient Reply

Simulate a patient reply coming from Africa's Talking:

```bash
# YES response
curl -X POST http://localhost:3000/api/sms/callback \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+27712345678",
    "text": "YES",
    "id": "test_msg_001",
    "date": "2026-01-23T10:30:00Z"
  }'
```

### Step 3: Check Replies

```bash
# View all unprocessed replies
curl "http://localhost:3000/api/sms/replies?processed=false"

# View only YES responses
curl "http://localhost:3000/api/sms/replies?response=YES"

# View summary statistics
curl http://localhost:3000/api/sms/summary
```

### Step 4: Mark as Processed

```bash
curl -X POST http://localhost:3000/api/sms/replies/test_msg_001/mark-processed
```

---

## Data Storage

SMS replies are stored in: `backend/data/sms_replies.json`

Example file structure:
```json
[
  {
    "id": "ATXid_1234567890",
    "phoneNumber": "+27712345678",
    "response": "YES",
    "rawText": "YES",
    "timestamp": "2026-01-23T10:30:00Z",
    "linkId": null,
    "processed": false,
    "processedAt": null
  },
  {
    "id": "ATXid_0987654321",
    "phoneNumber": "+27798765432",
    "response": "NO",
    "rawText": "No, sorry",
    "timestamp": "2026-01-23T10:35:00Z",
    "linkId": null,
    "processed": true,
    "processedAt": "2026-01-23T10:40:00Z"
  }
]
```

---

## Troubleshooting

### SMS Replies Not Being Received

1. **Check Africa's Talking Webhook URL**
   - Verify the webhook URL is correctly configured in Africa's Talking dashboard
   - For local testing, ensure you're using ngrok and have updated the URL

2. **Check Backend Logs**
   ```bash
   cd backend
   bun run dev
   # Look for "[Webhook] Incoming SMS callback:" messages
   ```

3. **Test Webhook Manually**
   ```bash
   curl -X POST http://localhost:3000/api/sms/callback \
     -H "Content-Type: application/json" \
     -d '{"from": "+27712345678", "text": "YES", "id": "test_123"}'
   ```

### Invalid Response Error

- Ensure the SMS text is exactly "YES" or "NO" (case-insensitive)
- Check the `rawText` field in the stored reply to see what was actually sent

### Webhook Not Being Called

1. Check that your server is running and accessible
2. Verify Africa's Talking has the correct webhook URL
3. For ngrok: Make sure ngrok tunnel is active and URL is current
4. Check Africa's Talking's webhook delivery logs in their dashboard

---

## Next Steps

1. **Integrate with Access Control**: When you receive a YES response, grant the requester access to the patient's medical records
2. **Send Confirmation SMS**: Send a confirmation SMS back to the patient after processing their response
3. **Set Up Database**: For production, replace the JSON file storage with a proper database
4. **Add Authentication**: Add API authentication to protect sensitive endpoints
5. **Monitor Replies**: Set up a monitoring dashboard to track reply rates and response times

---

## Useful Resources

- **Africa's Talking Docs**: https://africastalking.com/sms/api
- **Africa's Talking SMS Sandbox**: https://africastalking.com/sms/sandbox
- **ngrok Documentation**: https://ngrok.com/docs
- **Express.js API Documentation**: https://expressjs.com/
