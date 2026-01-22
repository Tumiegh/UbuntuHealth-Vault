# Ubuntu Health Vault

A secure healthcare platform for managing patient medical records and clinic operations in South Africa.

## Features

- 🏥 **Admin Dashboard** - Manage patient check-ins and queue
- 📱 **SMS Integration** - Send access requests to patients via Africa's Talking
- 👨‍⚕️ **Doctor Dashboard** - View and manage assigned patients
- 👤 **Patient Dashboard** - View personal medical records
- 🔒 **Secure Access Control** - SMS-based consent system

## Quick Start

### Prerequisites

- Node.js 18+
- Bun (optional, but recommended)
- Africa's Talking account (for SMS functionality)

### Setup Frontend & Backend

#### 1. Clone and Install

```bash
# Clone repository
git clone <YOUR_GIT_URL>
cd UbuntuHealth-Vault

# Install frontend dependencies
bun install
# or
npm install
```

#### 2. Setup Backend

```bash
cd backend

# Install backend dependencies
bun install
# or
npm install

# Create environment configuration
cp .env.example .env
```

Edit `.env` with your Africa's Talking credentials:
```
AFRICAS_TALKING_API_KEY=your_api_key_here
AFRICAS_TALKING_USERNAME=your_username_here
PORT=3000
```

#### 3. Start Both Servers

**Terminal 1 - Frontend (from project root):**
```bash
bun run dev
```

Output:
```
  VITE v5.4.19  ready in 315 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://10.200.130.142:8080/
  ➜  press h + enter to show help
```

**Terminal 2 - Backend (from backend directory):**
```bash
cd backend
bun server.js
```

Output:
```
╔══════════════════════════════════════════════════════╗
║  Ubuntu Health Vault Backend                         ║
║  Server running on http://localhost:3000             ║
║  Frontend: http://localhost:8080                     ║
║  Environment: development                            ║
╚══════════════════════════════════════════════════════╝
```

Now your app is ready:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000/api/checkin

## Testing the SMS Integration

Once both servers are running, you can test the SMS functionality:

```bash
curl -X POST http://localhost:3000/api/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "phoneNumber": "+27824556325",
    "idNumber": "9203124800082"
  }'
```

Response on success:
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

## Project Structure

```
UbuntuHealth-Vault/
├── src/                          # React frontend
│   ├── pages/
│   │   ├── AdminDashboard.tsx    # Staff check-in management
│   │   ├── DoctorDashboard.tsx   # Doctor patient view
│   │   ├── PatientDashboard.tsx  # Patient medical records
│   │   └── Index.tsx              # Landing page
│   ├── components/                # Reusable UI components
│   ├── api/
│   │   └── checkinService.ts      # Backend API calls
│   └── App.tsx
├── backend/                       # Express.js API server
│   ├── server.js                  # Main server
│   ├── routes/
│   │   └── checkin.js             # Check-in endpoints
│   ├── services/
│   │   └── smsService.js          # Africa's Talking integration
│   └── utils/
│       └── phoneValidator.js      # Phone number validation
└── package.json
```

## SMS Integration

The system uses **Africa's Talking** to send SMS access requests to patients:

1. **Check-in initiated** - Staff enters patient name and phone
2. **SMS sent** - Patient receives consent request via SMS
3. **Patient responds** - Patient replies YES/NO to grant/deny access
4. **Records accessible** - Upon consent, doctor can view patient records

For detailed setup instructions, see [backend/README.md](backend/README.md)

## Available Scripts

### Frontend
- `bun run dev` - Start development server (http://localhost:8080)
- `bun run build` - Build for production
- `bun run lint` - Check code quality
- `bun run test` - Run tests

### Backend
- `cd backend && bun run dev` - Start backend server (http://localhost:3000)
- `cd backend && bun run start` - Run production server

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast builds
- Tailwind CSS for styling
- shadcn/ui components
- Framer Motion for animations
- React Router for navigation
- React Hook Form for forms

### Backend
- Node.js with Express
- Africa's Talking SMS API
- CORS for security
- dotenv for configuration

## Environment Variables

### Backend (.env)
```
AFRICAS_TALKING_API_KEY=your_api_key
AFRICAS_TALKING_USERNAME=your_username
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

## API Endpoints

### POST `/api/checkin`
Send SMS access request to patient

**Request:**
```json
{
  "patientName": "John Doe",
  "phoneNumber": "0824556325",
  "idNumber": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Access request sent to patient",
  "phoneNumber": "+27824556325",
  "timestamp": "2026-01-22T10:30:00.000Z"
}
```

Phone numbers are automatically normalized to E.164 format (+27XXXXXXXXXX).

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## License

MIT

## Support

For issues and questions:
- Frontend issues: Check React console (F12)
- Backend issues: Check server terminal logs
- SMS issues: See backend/README.md troubleshooting


**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
