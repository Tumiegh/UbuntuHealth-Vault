# 🚀 Tech Stack Quick Reference

## Technology Overview

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.5.3 | Type Safety |
| Vite | 5.4.2 | Build Tool |
| Tailwind CSS | 3.4.1 | Styling |
| React Router | 6.26.2 | Navigation |
| Reown (WalletConnect) | 1.2.1 | Wallet Integration |
| Ethers.js | 6.13.2 | Blockchain Interaction |
| Wagmi | 2.12.17 | React Hooks for Ethereum |

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js/Bun | Latest | Runtime |
| Express.js | 4.18.2 | Web Framework |
| Ethers.js | 6.9.2 | Smart Contract SDK |
| CryptoJS | 4.2.0 | Encryption |
| Multer | 2.0.2 | File Upload |
| @web3-storage/w3up-client | 17.3.0 | IPFS Client |
| Africa's Talking | 0.7.8 | SMS/USSD |
| Helmet | 7.1.0 | Security Headers |
| Express Rate Limit | 7.1.5 | DDoS Protection |

### Blockchain Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Solidity | 0.8.20 | Smart Contract Language |
| Hardhat | 2.19.4 | Development Framework |
| OpenZeppelin | 5.0.1 | Security Standards |
| Base Sepolia | Testnet | Deployment Network |
| Ethers.js | 6.9.2 | Contract Interaction |

### Storage & Communication
| Technology | Purpose |
|------------|---------|
| IPFS (Storacha) | Decentralized File Storage |
| Africa's Talking | SMS & USSD Gateway |
| Base Sepolia RPC | Blockchain Network |

---

## Key File Locations

### Smart Contracts
```
contracts/
├── contracts/HealthVault.sol          # Main smart contract
├── scripts/deploy.js                  # Deployment script
├── scripts/copy-abi.js                # Copy ABI to frontend/backend
├── test/HealthVault.test.js           # Contract tests
└── hardhat.config.js                  # Hardhat configuration
```

### Backend
```
backend/
├── server.js                          # Main server file
├── config/
│   ├── blockchain.js                  # Blockchain connection
│   ├── africastalking.js              # SMS/USSD config
│   └── ipfs.js                        # IPFS configuration
├── routes/
│   ├── records.js                     # Medical records API
│   ├── access.js                      # Access control API
│   ├── ussd.js                        # USSD interface
│   └── smsWebhook.js                  # SMS webhook
└── utils/
    └── encryption.js                  # Encryption utilities
```

### Frontend
```
src/
├── config/
│   └── contract.ts                    # Smart contract ABI & address
├── components/                        # React components
├── pages/                             # Page components
└── App.tsx                            # Main app component
```

---

## Environment Variables

### Contracts (.env)
```env
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_wallet_private_key
BASESCAN_API_KEY=your_basescan_api_key
```

### Backend (.env)
```env
# Blockchain
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
HEALTH_VAULT_CONTRACT_ADDRESS=0x...

# Security
ENCRYPTION_KEY=your_32_char_key

# IPFS
W3UP_EMAIL=your_email@example.com

# SMS/USSD
AT_API_KEY=your_africastalking_key
AT_USERNAME=your_username

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_CONTRACT_ADDRESS=0x...
VITE_REOWN_PROJECT_ID=your_walletconnect_id
```

---

## Common Commands

### Smart Contracts
```bash
cd contracts

# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to Base Sepolia
npm run deploy

# Copy ABI to frontend/backend
node scripts/copy-abi.js

# Check wallet balance
node scripts/check-balance.js
```

### Backend
```bash
cd backend

# Install dependencies
npm install
# or
bun install

# Run development server
npm run dev

# Run production server
npm start
```

### Frontend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## API Endpoints Quick Reference

### Health Check
- `GET /health` - Server health status

### Records
- `POST /api/records/upload` - Upload medical record
- `GET /api/records/patient/:address` - Get patient records
- `GET /api/records/download/:ipfsHash` - Download record

### Access Control
- `POST /api/access/register-phone` - Register phone number
- `POST /api/access/request` - Request access
- `GET /api/access/pending/:address` - Get pending requests
- `GET /api/access/check` - Check access status

### USSD
- `POST /api/ussd` - USSD callback

### SMS
- `POST /api/sms` - SMS webhook

---

## Smart Contract Functions

### Patient Functions
- `addRecord(string ipfsHash)` - Add medical record
- `revokeRecord(uint256 index)` - Revoke record
- `grantAccess(bytes32 requestId, uint256 expiry)` - Grant access
- `revokeAccess(address doctor)` - Revoke access

### Doctor Functions
- `requestAccess(address patient)` - Request access
- `hasAccess(address patient, address doctor)` - Check access

### View Functions
- `getPatientRecords(address patient)` - Get all records
- `getPendingRequests(address patient)` - Get pending requests

---

## Security Features

✅ **Wallet-Based Authentication** - No passwords  
✅ **AES-256 Encryption** - Medical records encrypted  
✅ **On-Chain Access Control** - Blockchain permissions  
✅ **Time-Based Expiry** - Access automatically expires  
✅ **Rate Limiting** - DDoS protection  
✅ **CORS Protection** - Cross-origin security  
✅ **Helmet Security Headers** - HTTP security  
✅ **ReentrancyGuard** - Smart contract security  

---

## Network Information

**Base Sepolia Testnet**:
- Chain ID: `84532`
- RPC URL: `https://sepolia.base.org`
- Block Explorer: `https://sepolia.basescan.org`
- Faucet: Bridge from Sepolia ETH

---

## Useful Links

- [Full Technical Architecture](TECHNICAL_ARCHITECTURE.md)
- [Smart Contracts Setup](SMART_CONTRACTS_SETUP.md)
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
- [Integration Summary](INTEGRATION_SUMMARY.md)

---

**Quick Reference Version**: 1.0  
**Last Updated**: January 2026

