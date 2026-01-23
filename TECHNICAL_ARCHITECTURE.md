# 🏗️ Ubuntu Health Vault - Technical Architecture

## 📋 Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Data Flow](#data-flow)
- [Security Model](#security-model)
- [API Architecture](#api-architecture)

---

## 🎯 Overview

Ubuntu Health Vault is a **decentralized healthcare records management system** that combines traditional web technologies with blockchain and Web3 to create a secure, patient-controlled medical records platform.

### Core Principles
- **Patient Ownership**: Patients control their medical data
- **Decentralized Storage**: Records stored on IPFS, hashes on blockchain
- **Transparent Access**: All access requests/grants recorded on-chain
- **Multi-Channel Access**: Web, SMS, and USSD interfaces
- **Privacy First**: End-to-end encryption for medical records

---

## 🛠️ Technology Stack

### Frontend Layer
```
React 18.3.1 + TypeScript
├── Vite (Build Tool)
├── React Router (Navigation)
├── Tailwind CSS (Styling)
├── Reown/WalletConnect (Web3 Wallet Integration)
├── Ethers.js v6 (Blockchain Interaction)
└── Wagmi (React Hooks for Ethereum)
```

**Purpose**: User interface for patients, doctors, and administrators

**Key Features**:
- Wallet-based authentication (MetaMask, WalletConnect)
- Real-time blockchain transaction status
- Medical record upload/download
- Access control management
- Responsive design for mobile/desktop

---

### Backend Layer
```
Node.js/Bun + Express.js
├── Ethers.js v6 (Smart Contract Interaction)
├── Multer (File Upload Handling)
├── CryptoJS (Encryption/Decryption)
├── @web3-storage/w3up-client (IPFS Storage)
├── Africa's Talking SDK (SMS/USSD)
├── Helmet (Security Headers)
├── Express Rate Limit (DDoS Protection)
└── CORS (Cross-Origin Resource Sharing)
```

**Purpose**: API server, file processing, blockchain integration, SMS/USSD gateway

**Key Responsibilities**:
- Medical record encryption before IPFS upload
- Blockchain transaction management
- SMS notifications for access requests
- USSD menu system for feature phones
- Access control verification
- File upload/download management

---

### Blockchain Layer
```
Solidity 0.8.20 (Smart Contracts)
├── Hardhat (Development Framework)
├── OpenZeppelin Contracts (Security Standards)
│   ├── Ownable (Access Control)
│   └── ReentrancyGuard (Security)
├── Base Sepolia Testnet (Deployment Network)
└── Ethers.js (Contract Interaction)
```

**Purpose**: Immutable record of medical data hashes and access permissions

**Smart Contract Functions**:
- Store IPFS hashes of medical records
- Manage access control (grant/revoke)
- Time-based access expiry
- Event logging for transparency
- Decentralized identity (wallet addresses)

---

### Storage Layer
```
IPFS (InterPlanetary File System)
└── Storacha/web3.storage (IPFS Pinning Service)
```

**Purpose**: Decentralized storage for encrypted medical records

**Why IPFS?**:
- Decentralized (no single point of failure)
- Content-addressed (tamper-proof)
- Permanent storage
- Cost-effective

---

### Communication Layer
```
Africa's Talking API
├── SMS (Notifications)
└── USSD (Feature Phone Interface)
```

**Purpose**: Enable access for users without smartphones or internet

**Use Cases**:
- SMS notifications for access requests
- SMS notifications for access grants/revokes
- USSD menu for granting/revoking access
- Works on basic feature phones

---

## 🏛️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Patient    │  │    Doctor    │  │    Admin     │      │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │ WalletConnect  │                        │
│                    │   + Ethers.js  │                        │
│                    └───────┬────────┘                        │
└────────────────────────────┼──────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │  (Express.js)   │
                    └────────┬────────┘
                             │
        ┏━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━┓
        ▼                    ▼                     ▼
┌───────────────┐   ┌────────────────┐   ┌────────────────┐
│   Blockchain  │   │  IPFS Storage  │   │  SMS/USSD API  │
│   (Base L2)   │   │  (Storacha)    │   │ (Africa's Talk)│
│               │   │                │   │                │
│ HealthVault   │   │  Encrypted     │   │  Notifications │
│ Smart Contract│   │  Medical Files │   │  USSD Menus    │
└───────────────┘   └────────────────┘   └────────────────┘
```

---

## 🔄 Data Flow

### 1. **Patient Uploads Medical Record**

```
1. Patient → Frontend: Select file + metadata
2. Frontend → Backend: POST /api/records/upload
3. Backend: Encrypt file with CryptoJS (AES-256)
4. Backend → IPFS: Upload encrypted file
5. IPFS → Backend: Return IPFS hash (e.g., QmXxx...)
6. Backend → Blockchain: Call addRecord(ipfsHash)
7. Smart Contract: Store hash + emit RecordAdded event
8. Blockchain → Backend: Transaction receipt
9. Backend → Frontend: Success response
10. Frontend: Display confirmation + transaction hash
```

**Key Points**:
- File is encrypted BEFORE upload to IPFS
- Only IPFS hash is stored on blockchain (not the file itself)
- Patient's wallet address is the record owner
- Transaction is immutable and transparent

---

### 2. **Doctor Requests Access to Patient Records**

```
1. Doctor → Frontend: Enter patient wallet address
2. Frontend → Backend: POST /api/access/request
3. Backend → Blockchain: Call requestAccess(patientAddress)
4. Smart Contract: Create access request + emit AccessRequested event
5. Backend → SMS API: Send notification to patient
6. SMS API → Patient: "Dr. X requests access to your records"
7. Patient receives SMS with request details
```

**Alternative Flow (USSD)**:
```
Patient → Feature Phone: Dial *134*HEALTH#
USSD Gateway → Backend: POST /api/ussd
Backend: Display pending requests menu
Patient: Select "Grant Access" option
Backend → Blockchain: Call grantAccess(doctorAddress, expiryTime)
```

---

### 3. **Patient Grants Access**

```
1. Patient → Frontend: Review pending requests
2. Frontend → Blockchain: Call grantAccess(requestId, expiryTime)
3. Smart Contract: 
   - Mark request as granted
   - Set expiry timestamp
   - Emit AccessGranted event
4. Backend (Event Listener): Detect AccessGranted event
5. Backend → SMS API: Notify doctor
6. SMS API → Doctor: "Patient Y granted you access"
```

**Access Expiry Options**:
- 24 hours
- 7 days  
- 30 days
- Permanent (no expiry)

---

### 4. **Doctor Views Patient Records**

```
1. Doctor → Frontend: Request patient records
2. Frontend → Blockchain: Call hasAccess(patientAddress, doctorAddress)
3. Smart Contract: Check access + expiry time
4. If access granted:
   a. Frontend → Blockchain: Call getPatientRecords(patientAddress)
   b. Blockchain → Frontend: Return array of IPFS hashes
   c. Frontend → Backend: GET /api/records/download/:ipfsHash
   d. Backend: Verify blockchain access again
   e. Backend → IPFS: Fetch encrypted file
   f. Backend: Decrypt file with CryptoJS
   g. Backend → Frontend: Return decrypted file
   h. Frontend: Display medical record
5. If access denied:
   - Return error: "Access denied or expired"
```

**Security Checks**:
- ✅ Blockchain verification (on-chain)
- ✅ Backend verification (off-chain)
- ✅ Time-based expiry check
- ✅ Encryption/decryption

---

## 🔐 Security Model

### Multi-Layer Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Authentication (Web3 Wallet)                   │
│ - Wallet signature verification                         │
│ - No passwords (wallet-based auth)                      │
│ - Private key never leaves user's device                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 2: Encryption (AES-256)                           │
│ - Medical records encrypted before IPFS upload          │
│ - Encryption key stored securely in backend .env        │
│ - Only authorized backend can decrypt                   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 3: Access Control (Smart Contract)                │
│ - On-chain permission verification                      │
│ - Time-based access expiry                              │
│ - Immutable audit trail                                 │
│ - Patient-controlled access grants                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 4: Network Security                               │
│ - HTTPS/TLS encryption                                  │
│ - CORS protection                                       │
│ - Rate limiting (DDoS protection)                       │
│ - Helmet.js security headers                            │
└─────────────────────────────────────────────────────────┘
```

### Encryption Flow

**Medical Record Encryption (AES-256-CBC)**:
```javascript
// Backend encryption before IPFS upload
const CryptoJS = require('crypto-js');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Encrypt
const encrypted = CryptoJS.AES.encrypt(
  fileContent,
  ENCRYPTION_KEY
).toString();

// Upload to IPFS
const ipfsHash = await uploadToIPFS(encrypted);

// Store hash on blockchain
await contract.addRecord(ipfsHash);
```

**Decryption (Only for Authorized Access)**:
```javascript
// Verify blockchain access first
const hasAccess = await contract.hasAccess(patientAddress, doctorAddress);
if (!hasAccess) throw new Error('Access denied');

// Fetch from IPFS
const encryptedContent = await fetchFromIPFS(ipfsHash);

// Decrypt
const decrypted = CryptoJS.AES.decrypt(
  encryptedContent,
  ENCRYPTION_KEY
).toString(CryptoJS.enc.Utf8);
```

### Smart Contract Security

**OpenZeppelin Standards**:
- `Ownable`: Only contract owner can perform admin functions
- `ReentrancyGuard`: Prevents reentrancy attacks
- Solidity 0.8.20: Built-in overflow protection

**Access Control Logic**:
```solidity
function hasAccess(address patient, address doctor) public view returns (bool) {
    AccessGrant memory grant = accessGrants[patient][doctor];

    // Check if access was granted
    if (!grant.granted) return false;

    // Check if access has expired
    if (grant.expiryTime > 0 && block.timestamp > grant.expiryTime) {
        return false;
    }

    return true;
}
```

---

## 🌐 API Architecture

### RESTful API Endpoints

#### **Health Check**
```
GET /health
Response: { status: "ok", timestamp: "..." }
```

#### **Records Management**
```
POST /api/records/upload
Body: FormData { file, patientAddress, recordType, description }
Response: { success: true, ipfsHash, transactionHash }

GET /api/records/patient/:patientAddress
Response: { records: [...] }

GET /api/records/download/:ipfsHash
Query: { requesterAddress, patientAddress }
Response: Decrypted file (if access granted)
```

#### **Access Control**
```
POST /api/access/register-phone
Body: { walletAddress, phoneNumber }
Response: { success: true }

POST /api/access/request
Body: { doctorAddress, patientAddress }
Response: { success: true, requestId, smsStatus }

GET /api/access/pending/:patientAddress
Response: { requests: [...] }

GET /api/access/check
Query: { patientAddress, doctorAddress }
Response: { hasAccess: true/false, expiryTime }
```

#### **USSD Interface**
```
POST /api/ussd
Body: { sessionId, serviceCode, phoneNumber, text }
Response: USSD menu text
```

#### **SMS Webhook**
```
POST /api/sms
Body: Africa's Talking webhook payload
Response: { success: true }
```

### API Security

**Rate Limiting**:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

**CORS Configuration**:
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

**Security Headers (Helmet)**:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## 🔗 Smart Contract Architecture

### HealthVault.sol Contract Structure

```solidity
contract HealthVault is Ownable, ReentrancyGuard {
    // Data Structures
    struct MedicalRecord {
        string ipfsHash;      // IPFS hash of encrypted file
        uint256 timestamp;    // When record was added
        bool isActive;        // Can be revoked
    }

    struct AccessRequest {
        address doctor;       // Doctor requesting access
        uint256 timestamp;    // When request was made
        bool granted;         // Has patient granted access
    }

    struct AccessGrant {
        bool granted;         // Is access granted
        uint256 expiryTime;   // When access expires (0 = permanent)
        uint256 grantedAt;    // When access was granted
    }

    // Mappings
    mapping(address => MedicalRecord[]) public patientRecords;
    mapping(address => mapping(bytes32 => AccessRequest)) public accessRequests;
    mapping(address => mapping(address => AccessGrant)) public accessGrants;

    // Events
    event RecordAdded(address indexed patient, string ipfsHash, uint256 timestamp);
    event RecordRevoked(address indexed patient, uint256 recordIndex);
    event AccessRequested(bytes32 indexed requestId, address indexed patient, address indexed doctor);
    event AccessGranted(address indexed patient, address indexed doctor, uint256 expiryTime);
    event AccessRevoked(address indexed patient, address indexed doctor);
}
```

### Key Contract Functions

**Patient Functions**:
```solidity
// Add a medical record
function addRecord(string memory ipfsHash) external nonReentrant

// Revoke a record
function revokeRecord(uint256 recordIndex) external

// Grant access to a doctor
function grantAccess(bytes32 requestId, uint256 expiryTime) external

// Revoke doctor's access
function revokeAccess(address doctor) external
```

**Doctor Functions**:
```solidity
// Request access to patient records
function requestAccess(address patient) external returns (bytes32)

// Check if has access
function hasAccess(address patient, address doctor) public view returns (bool)
```

**View Functions**:
```solidity
// Get all patient records
function getPatientRecords(address patient) external view returns (MedicalRecord[] memory)

// Get pending access requests
function getPendingRequests(address patient) external view returns (AccessRequest[] memory)
```

---

## 📊 Database & State Management

### On-Chain State (Blockchain)
```
Smart Contract Storage:
├── Patient Records (IPFS hashes only)
├── Access Grants (doctor → patient mappings)
├── Access Requests (pending approvals)
└── Timestamps & Expiry Times
```

**Why On-Chain?**:
- ✅ Immutable audit trail
- ✅ Transparent access control
- ✅ No central authority
- ✅ Patient owns their data

### Off-Chain Storage (IPFS)
```
IPFS Storage:
└── Encrypted Medical Files
    ├── PDF documents
    ├── Medical images
    ├── Lab results
    └── Prescriptions
```

**Why Off-Chain?**:
- ✅ Cost-effective (blockchain storage is expensive)
- ✅ Large file support
- ✅ Decentralized storage
- ✅ Content-addressed (tamper-proof)

### Frontend State (React)
```
React State Management:
├── Wallet Connection (Wagmi/WalletConnect)
├── User Profile (wallet address, role)
├── Medical Records (fetched from blockchain)
├── Access Requests (pending/granted)
└── Transaction Status (pending/confirmed)
```

---

## 🔄 Event-Driven Architecture

### Blockchain Events

The smart contract emits events that can be listened to by the backend:

```javascript
// Backend event listener
const contract = getContract();

// Listen for AccessRequested events
contract.on('AccessRequested', async (requestId, patient, doctor, event) => {
  console.log(`Access requested: ${doctor} → ${patient}`);

  // Send SMS notification to patient
  await sendAccessRequestNotification(patient, doctor);
});

// Listen for AccessGranted events
contract.on('AccessGranted', async (patient, doctor, expiryTime, event) => {
  console.log(`Access granted: ${patient} → ${doctor}`);

  // Send SMS notification to doctor
  await sendAccessGrantedNotification(doctor, patient, expiryTime);
});
```

### Event Flow

```
Smart Contract Event → Backend Listener → SMS/USSD Notification → User
```

**Benefits**:
- Real-time notifications
- Decoupled architecture
- Scalable event processing
- Audit trail

---

## 🌍 Network Architecture

### Base Sepolia Testnet

**Why Base?**:
- ✅ Layer 2 (lower gas fees than Ethereum mainnet)
- ✅ EVM-compatible (works with existing tools)
- ✅ Fast transactions (~2 seconds)
- ✅ Backed by Coinbase
- ✅ Easy bridge from Ethereum

**Network Details**:
```
Chain ID: 84532
RPC URL: https://sepolia.base.org
Block Explorer: https://sepolia.basescan.org
Native Token: ETH (testnet)
```

### RPC Provider Setup

```javascript
// Backend blockchain config
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider(
  process.env.BASE_SEPOLIA_RPC_URL
);

const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);

const contract = new ethers.Contract(
  process.env.HEALTH_VAULT_CONTRACT_ADDRESS,
  HEALTH_VAULT_ABI,
  wallet
);
```

---

## 📱 Multi-Channel Access

### 1. Web Interface (Primary)

**Technology**: React + WalletConnect

**User Flow**:
```
1. User visits website
2. Clicks "Connect Wallet"
3. Scans QR code with mobile wallet (MetaMask, Trust Wallet, etc.)
4. Wallet connected → User authenticated
5. Access dashboard based on role (Patient/Doctor/Admin)
```

**Supported Wallets**:
- MetaMask
- WalletConnect-compatible wallets
- Coinbase Wallet
- Trust Wallet
- Rainbow Wallet

---

### 2. SMS Interface (Notifications)

**Technology**: Africa's Talking SMS API

**Use Cases**:
- Access request notifications
- Access granted/revoked notifications
- Emergency alerts
- Appointment reminders

**Example SMS**:
```
Ubuntu Health Vault:
Dr. John Smith (0x1234...5678) has requested
access to your medical records.
Reply GRANT to approve or visit
https://app.ubuntuhealth.com to manage access.
```

---

### 3. USSD Interface (Feature Phones)

**Technology**: Africa's Talking USSD API

**Dial Code**: `*134*HEALTH#` (example)

**USSD Menu Flow**:
```
*134*HEALTH#
→ Welcome to Ubuntu Health Vault
  1. View Pending Requests
  2. Grant Access
  3. Revoke Access
  4. My Records
  5. Help

User selects: 1
→ Pending Access Requests:
  1. Dr. John Smith
  2. Dr. Jane Doe

User selects: 1
→ Grant access to Dr. John Smith?
  1. 24 hours
  2. 7 days
  3. 30 days
  4. Permanent

User selects: 2
→ Access granted for 7 days!
  Transaction: 0xabc...def
```

**Benefits**:
- Works on basic feature phones
- No internet required
- Accessible to all users
- Low-cost transactions

---

## 🔧 Development & Deployment

### Local Development Setup

**1. Frontend Development**:
```bash
npm install
npm run dev
# Runs on http://localhost:5173
```

**2. Backend Development**:
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3000
```

**3. Smart Contract Development**:
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
npx hardhat node  # Local blockchain
```

### Testing Strategy

**Smart Contract Tests** (Hardhat + Chai):
```javascript
describe("HealthVault", function () {
  it("Should add a medical record", async function () {
    await healthVault.addRecord("QmTest123");
    const records = await healthVault.getPatientRecords(patient.address);
    expect(records.length).to.equal(1);
  });

  it("Should grant and verify access", async function () {
    await healthVault.connect(doctor).requestAccess(patient.address);
    await healthVault.connect(patient).grantAccess(requestId, expiryTime);
    const hasAccess = await healthVault.hasAccess(patient.address, doctor.address);
    expect(hasAccess).to.be.true;
  });
});
```

**Backend API Tests** (Jest/Supertest):
```javascript
describe('POST /api/records/upload', () => {
  it('should upload and encrypt medical record', async () => {
    const response = await request(app)
      .post('/api/records/upload')
      .attach('file', 'test-record.pdf')
      .field('patientAddress', '0x123...')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.ipfsHash).toBeDefined();
  });
});
```

### Deployment Pipeline

```
1. Development
   ├── Local testing
   ├── Smart contract tests
   └── API tests

2. Testnet Deployment
   ├── Deploy contracts to Base Sepolia
   ├── Verify contracts on BaseScan
   ├── Deploy backend to staging
   └── Deploy frontend to staging

3. Production Deployment
   ├── Audit smart contracts
   ├── Deploy to Base Mainnet
   ├── Deploy backend to production
   ├── Deploy frontend to production
   └── Monitor and maintain
```

---

## 🎯 Key Technical Decisions

### Why Blockchain?
- **Immutability**: Medical records can't be tampered with
- **Transparency**: All access is logged and auditable
- **Patient Control**: Patients own their data via wallet
- **Decentralization**: No single point of failure
- **Trust**: Cryptographic proof instead of trust in institutions

### Why IPFS?
- **Decentralized**: No central server to fail or be censored
- **Cost-Effective**: Cheaper than storing large files on blockchain
- **Content-Addressed**: Files are identified by their content hash
- **Permanent**: Files persist as long as someone pins them
- **Scalable**: Can handle large medical files (X-rays, MRIs, etc.)

### Why Base (Layer 2)?
- **Low Fees**: ~$0.01 per transaction vs $10+ on Ethereum mainnet
- **Fast**: 2-second block times
- **EVM-Compatible**: Use existing Ethereum tools
- **Secure**: Inherits Ethereum's security
- **Backed by Coinbase**: Strong institutional support

### Why Encryption?
- **Privacy**: Medical data is sensitive
- **Compliance**: HIPAA/POPIA requirements
- **Security**: Even if IPFS is public, data is encrypted
- **Access Control**: Only authorized parties can decrypt

### Why Multi-Channel (Web/SMS/USSD)?
- **Accessibility**: Not everyone has smartphones
- **Inclusivity**: Reach rural and underserved communities
- **Redundancy**: Multiple ways to access the system
- **South African Context**: High feature phone usage

---

## 📈 Scalability Considerations

### Current Architecture Limits
- **Blockchain**: ~1000 TPS on Base L2
- **IPFS**: Unlimited storage (pay for pinning)
- **Backend**: Depends on hosting (can scale horizontally)
- **SMS/USSD**: Africa's Talking handles millions of messages

### Scaling Strategies

**Horizontal Scaling**:
```
Load Balancer
    ├── Backend Instance 1
    ├── Backend Instance 2
    ├── Backend Instance 3
    └── Backend Instance N
```

**Caching**:
```javascript
// Cache frequently accessed data
const cache = new Map();

async function getPatientRecords(address) {
  if (cache.has(address)) {
    return cache.get(address);
  }

  const records = await contract.getPatientRecords(address);
  cache.set(address, records);
  return records;
}
```

**IPFS Optimization**:
- Use IPFS gateways for faster retrieval
- Pin frequently accessed files
- Implement CDN for static content

---

## 🔍 Monitoring & Observability

### Metrics to Track

**Blockchain Metrics**:
- Transaction success rate
- Gas fees
- Block confirmation times
- Contract event emissions

**Backend Metrics**:
- API response times
- Error rates
- Request volume
- Database query performance

**User Metrics**:
- Wallet connections
- Record uploads
- Access requests/grants
- USSD session completions

### Logging Strategy

```javascript
// Structured logging
const logger = {
  info: (message, metadata) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...metadata
    }));
  },
  error: (message, error) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }));
  }
};

// Usage
logger.info('Record uploaded', {
  ipfsHash: 'QmXxx',
  patientAddress: '0x123'
});
```

---

## 🎓 Summary

Ubuntu Health Vault is a **hybrid Web2/Web3 application** that combines:

✅ **Traditional Web Technologies** (React, Express.js, REST APIs)
✅ **Blockchain** (Smart contracts, decentralized access control)
✅ **Decentralized Storage** (IPFS for medical files)
✅ **Multi-Channel Access** (Web, SMS, USSD)
✅ **Strong Security** (Encryption, wallet-based auth, on-chain permissions)

This architecture provides:
- **Patient ownership** of medical data
- **Transparent** and **auditable** access control
- **Accessible** to all users (smartphones and feature phones)
- **Secure** and **private** medical record storage
- **Scalable** and **cost-effective** infrastructure

---

## 📚 Further Reading

- [Ethereum Documentation](https://ethereum.org/developers)
- [Base Network Docs](https://docs.base.org/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Africa's Talking API](https://developers.africastalking.com/)
- [WalletConnect Documentation](https://docs.walletconnect.com/)

---

**Document Version**: 1.0
**Last Updated**: January 2026
**Maintained By**: Ubuntu Health Vault Team


