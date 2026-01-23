# Smart Contracts Setup Guide

This guide will help you set up and deploy the HealthVault smart contracts for the Ubuntu Health Vault project.

## 📋 Overview

The smart contracts have been successfully integrated into this project from the UbuntuHealth-Vault repository. The contracts provide:

- **Medical Record Management**: Store IPFS hashes of encrypted medical records on-chain
- **Access Control**: Manage doctor access to patient records with expiry times
- **Decentralized Identity**: Patient and doctor wallet addresses serve as DIDs
- **Event Logging**: All actions are logged as blockchain events

## 🗂️ Project Structure

```
contracts/
├── contracts/
│   └── HealthVault.sol          # Main smart contract
├── scripts/
│   ├── deploy.js                # Deployment script
│   ├── copy-abi.js              # Copy ABI to frontend/backend
│   ├── check-balance.js         # Check wallet balance
│   └── generate-wallet.js       # Generate new wallet
├── test/
│   └── HealthVault.test.js      # Contract tests
├── hardhat.config.js            # Hardhat configuration
├── package.json                 # Contract dependencies
└── .env.example                 # Environment variables template

backend/
├── config/
│   ├── blockchain.js            # Blockchain connection config
│   └── africastalking.js        # SMS/USSD integration
└── routes/
    ├── access.js                # Access control routes
    ├── records.js               # Medical records routes (updated)
    └── ussd.js                  # USSD interface routes

src/
└── config/
    └── contract.ts              # Frontend contract config (updated)
```

## 🚀 Quick Start

### 1. Install Contract Dependencies

```bash
cd contracts
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `contracts` directory:

```bash
cp .env.example .env
```

Edit `.env` and add:

```env
# Base Sepolia RPC URL
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Your wallet private key (DO NOT COMMIT THIS!)
PRIVATE_KEY=your_private_key_here

# BaseScan API Key for verification
BASESCAN_API_KEY=your_basescan_api_key_here
```

**⚠️ IMPORTANT**: Never commit your `.env` file with real private keys!

### 3. Get Test ETH

You need Base Sepolia testnet ETH to deploy:

1. Get Sepolia ETH from: https://sepoliafaucet.com/
2. Bridge to Base Sepolia: https://bridge.base.org/

### 4. Compile Contracts

```bash
npm run compile
```

### 5. Run Tests (Optional but Recommended)

```bash
npm test
```

### 6. Deploy to Base Sepolia

```bash
npm run deploy
```

Save the deployed contract address!

### 7. Copy ABI to Frontend and Backend

```bash
node scripts/copy-abi.js
```

### 8. Update Environment Variables

Update `backend/.env`:
```env
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
HEALTH_VAULT_CONTRACT_ADDRESS=0x_your_deployed_contract_address
```

Update your frontend `.env` (root directory):
```env
VITE_CONTRACT_ADDRESS=0x_your_deployed_contract_address
```

## 📝 Contract Functions

### Patient Functions
- `addRecord(string ipfsHash)` - Add a medical record
- `revokeRecord(uint256 recordIndex)` - Revoke a record
- `grantAccess(bytes32 requestId, uint256 expiryTime)` - Grant doctor access
- `revokeAccess(address doctor)` - Revoke doctor access
- `getPatientRecords(address patient)` - Get all records
- `getPendingRequests(address patient)` - Get pending access requests

### Doctor Functions
- `requestAccess(address patient)` - Request access to patient records
- `hasAccess(address patient, address doctor)` - Check access status

## 🔧 Backend Integration

The backend now includes:

1. **Blockchain Configuration** (`backend/config/blockchain.js`)
   - Connects to Base Sepolia
   - Provides contract instance
   - Manages wallet for backend operations

2. **Access Control Routes** (`backend/routes/access.js`)
   - Register phone numbers
   - Request/grant/revoke access
   - Check access status

3. **Updated Records Routes** (`backend/routes/records.js`)
   - Blockchain access verification
   - Fetch records from blockchain

4. **USSD Interface** (`backend/routes/ussd.js`)
   - USSD menu for feature phones
   - Grant/revoke access via USSD

## 🎯 Next Steps

1. ✅ Smart contracts copied and configured
2. ✅ Backend routes integrated
3. ✅ Frontend contract config updated
4. 🔲 Deploy contracts to Base Sepolia
5. 🔲 Update environment variables with contract address
6. 🔲 Test contract integration
7. 🔲 Verify contract on BaseScan (optional)

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Base Network Docs](https://docs.base.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethers.js Documentation](https://docs.ethers.org/)

## 🆘 Troubleshooting

### "Insufficient funds" error
- Make sure you have Base Sepolia ETH in your wallet
- Check balance: `node scripts/check-balance.js`

### "Contract not deployed" error
- Verify the contract address in your `.env` files
- Make sure you ran `npm run deploy` successfully

### "Cannot connect to network" error
- Check your RPC URL is correct
- Try using a different RPC provider (Alchemy, Infura, etc.)

## 🔐 Security Notes

- Never commit private keys to version control
- Use environment variables for all sensitive data
- The `.env` file is in `.gitignore` - keep it that way!
- For production, use a hardware wallet or secure key management service

