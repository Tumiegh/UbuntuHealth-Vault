# Admin Dashboard - SMS Integration Updates

## Changes Made

### 1. **Fixed Page Refresh Bug**
- **Problem**: Patients disappeared when page was refreshed
- **Solution**: Implemented localStorage persistence
- Waiting patients are now stored in `localStorage.waitingPatients`
- Completed patients are stored in `localStorage.completedPatients`
- Phone-to-patient mapping stored in `localStorage.phoneToPatientMap`

### 2. **SMS Reply Polling**
- **Implementation**: Added automatic polling every 5 seconds to check for SMS replies
- **Logic**: 
  - Fetches replies from backend (`GET /api/sms/replies`)
  - Matches phone numbers to patients using `phoneToPatientMap`
  - Updates patient status when reply is received

### 3. **Status Update on YES Response**
- **When patient replies YES**:
  - Patient status automatically changes from `awaiting_consent` to `consent_granted`
  - Status badge updates to show "Ready to Assign"
  - Patient can now be assigned to a doctor

- **When patient replies NO**:
  - Patient is removed from the queue

### 4. **New Frontend Components**

#### SMS Service (`src/api/smsService.ts`)
Provides functions to interact with the backend SMS endpoints:
- `fetchSMSReplies()` - Get all SMS replies with filters
- `getSMSReplyById()` - Get specific reply
- `markSMSReplyAsProcessed()` - Mark reply as processed
- `fetchSMSSummary()` - Get SMS statistics

#### Updated AdminDashboard (`src/pages/AdminDashboard.tsx`)
- Added SMS polling effect (runs every 5 seconds)
- Added refresh button in header
- Stores phone-to-patient mapping when patient is added
- Auto-updates patient status when YES reply is received
- All data persists in localStorage

### 5. **Phone Number Mapping**
When a patient check-in is submitted:
1. Backend sends SMS from shortcode 5169
2. Frontend stores mapping: `phoneNumber → patientId`
3. When SMS reply arrives, backend sends phone number
4. Frontend looks up which patient replied and updates status

## How It Works

### User Flow:
1. Admin clicks "New Check-In"
2. Admin enters patient name and phone number
3. Backend sends SMS to patient from shortcode 5169
4. Patient replies "YES" or "NO" to shortcode
5. Africa's Talking webhook calls backend with reply
6. Frontend polls backend every 5 seconds
7. Frontend sees reply and updates patient status automatically
8. Patient appears as "Ready to Assign" if YES
9. Admin can now assign patient to a doctor

### Data Persistence:
- All patient data stored in localStorage
- Survives page refreshes
- SMS phone mappings stored for reply processing

## Backend Endpoints Used

- `POST /api/checkin` - Send SMS access request
- `GET /api/sms/replies` - Fetch SMS replies
- `GET /api/sms/summary` - Get SMS statistics

## Testing

### Test Scenario:
1. Start backend: `bun run dev`
2. Start ngrok: `ngrok http 3000`
3. Configure Africa's Talking webhook URL in dashboard
4. In admin portal, click "New Check-In"
5. Enter patient name and phone number
6. In Africa's Talking sandbox, send reply "YES"
7. Within 5 seconds, patient status should update to "Ready to Assign"

### Expected Logs:
```
✅ Patient 1 granted consent via SMS
Patient Queue updated
Patient status: consent_granted
```

## Environment Requirements

Make sure backend .env has:
```
AFRICAS_TALKING_API_KEY=your_key
AFRICAS_TALKING_USERNAME=sandbox
AFRICAS_TALKING_SHORTCODE=5169
```

And frontend env has:
```
VITE_API_URL=http://localhost:3000
```

## Future Enhancements

- [ ] Add SMS reminder sending (currently shows button, not functional)
- [ ] Add real-time WebSocket updates instead of polling
- [ ] Add patient consent history tracking
- [ ] Add SMS reply notifications/toast alerts
- [ ] Add statistics dashboard for reply rates
