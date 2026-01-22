# Ubuntu Health Vault - Backend SMS Integration Guide

## Overview

This backend integrates **Africa's Talking** to send SMS access requests to patients. When a clinic staff member initiates a check-in through the admin portal, an SMS is automatically sent to the patient's phone requesting permission to access their medical records.

## Architecture

```
Frontend (React) ──► Backend (Express) ──► Africa's Talking API ──► Patient SMS
   AdminDashboard        /api/checkin          SMS Service
```

## Setup Instructions

### 1. Get Africa's Talking Credentials

1. Visit [https://africastalking.com](https://africastalking.com)
2. Create a free account
3. Go to your dashboard and find:
   - **API Key** (in Account Settings → API Keys)
   - **Username** (displayed in your account profile)
4. For development/testing, use the **Sandbox API** credentials

### 2. Configure Environment Variables

1. In the `backend` directory, create a `.env` file based on `.env.example`:

```bash
cd backend
cp .env.example .env
```

2. Edit `.env` with your credentials:

```
AFRICAS_TALKING_API_KEY=your_actual_api_key_here
AFRICAS_TALKING_USERNAME=your_username_here
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
# or
bun install
```

### 4. Start the Backend Server

```bash
npm run dev
# or
bun run dev
```

You should see:
```
╔══════════════════════════════════════════════════════╗
║  Ubuntu Health Vault Backend                         ║
║  Server running on http://localhost:3000             ║
║  Frontend: http://localhost:8080                     ║
║  Environment: development                            ║
╚══════════════════════════════════════════════════════╝
```

## API Endpoints

### POST `/api/checkin`

**Purpose:** Initiate patient check-in and send SMS access request

**Request Body:**
```json
{
  "patientName": "John Doe",
  "phoneNumber": "0824556325",  // Accepts any format
  "idNumber": "9203124800082"   // Optional
}
```

**Phone Number Formats Accepted:**
- `+27824556325` (E.164 format - preferred)
- `0824556325` (South African local format)
- `27824556325` (Country code without +)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Access request sent to patient",
  "patientName": "John Doe",
  "phoneNumber": "+27824556325",
  "idNumber": "9203124800082",
  "timestamp": "2026-01-22T10:30:00.000Z",
  "smsStatus": "sent"
}
```

**Response (Error - 400/500):**
```json
{
  "success": false,
  "error": "Invalid phone number format. Please use format like +27824556325 or 0824556325"
}
```

### GET `/health`

**Purpose:** Check if backend server is running

**Response:**
```json
{
  "status": "ok",
  "message": "Ubuntu Health Vault Backend is running",
  "timestamp": "2026-01-22T10:30:00.000Z"
}
```

## Phone Number Validation

The backend automatically:
1. **Accepts flexible formats** - numbers can be in any format
2. **Normalizes to E.164** - converts to `+27XXXXXXXXXX` format (South African standard)
3. **Validates** - ensures the number is a valid South African mobile number
4. **Rejects invalid numbers** - returns clear error messages

### Examples:
| Input | Valid? | Output |
|-------|--------|--------|
| `+27824556325` | ✅ | `+27824556325` |
| `0824556325` | ✅ | `+27824556325` |
| `27824556325` | ✅ | `+27824556325` |
| `824556325` | ❌ | Invalid |
| `+27 824 556 325` | ✅ | `+27824556325` |

## SMS Message Format

When a check-in is initiated, the patient receives:

> "Hi [Patient Name], your clinic has requested access to your medical records. Reply YES to grant access or NO to deny."

## Backend File Structure

```
backend/
├── server.js                    # Main Express server
├── package.json                 # Dependencies
├── .env.example                 # Environment config template
├── routes/
│   └── checkin.js              # Check-in endpoint logic
├── services/
│   └── smsService.js           # Africa's Talking SMS wrapper
└── utils/
    └── phoneValidator.js       # Phone number validation
```

## Common Issues & Solutions

### Issue: "Failed to connect to backend"
**Solution:** Ensure backend server is running with `npm run dev`

### Issue: "Invalid phone number format"
**Solution:** Use South African numbers starting with 27 or 0
- ❌ `+441234567890` (UK number)
- ✅ `+27824556325` (South Africa)

### Issue: "Africa's Talking credentials not configured"
**Solution:** 
1. Create `.env` file in backend directory
2. Add your API key and username
3. Restart backend server

### Issue: "SMS not sending in production"
**Solution:**
1. Switch from Sandbox to Live API credentials on Africa's Talking dashboard
2. Ensure you have sufficient account balance
3. Check that the sender ID is registered

## Testing the Integration

### Using cURL:
```bash
curl -X POST http://localhost:3000/api/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Test Patient",
    "phoneNumber": "+27824556325",
    "idNumber": "1234567890"
  }'
```

### Using the Admin Portal:
1. Open http://localhost:8080
2. Navigate to Admin Dashboard
3. Click "New Check-In"
4. Enter patient details
5. Click "Send Request"
6. Observe SMS being sent to the patient's phone

## Security Considerations

1. **Never commit `.env`** - Add to `.gitignore` (already done)
2. **API Keys are sensitive** - Use environment variables, never hardcode
3. **Validate all inputs** - Backend validates phone numbers and formats
4. **CORS configured** - Only accepts requests from frontend URL
5. **Error handling** - Doesn't leak sensitive information in error messages

## Monitoring & Logging

The server logs all activity:
- Check-in requests
- SMS status
- Validation errors
- API failures

Check the console output to debug issues.

## Next Steps

- Implement SMS response handling (when patient replies YES/NO)
- Add database persistence for check-in history
- Implement appointment scheduling
- Add bulk SMS capabilities
- Set up SMS delivery callbacks

## Support

For issues with Africa's Talking API:
- Documentation: https://africastalking.com/sms/api
- Support: https://africastalking.com/support

For issues with this integration, check the console logs in both frontend and backend.
