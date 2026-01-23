# 🚀 Deployment Checklist

Use this checklist to deploy and configure the Ubuntu Health Vault with blockchain integration.

---

## ✅ Pre-Deployment Setup

### 1. Install Dependencies

- [ ] Install contract dependencies
  ```bash
  cd contracts && npm install
  ```

- [ ] Install backend dependencies
  ```bash
  cd backend && npm install
  # or
  cd backend && bun install
  ```

- [ ] Install frontend dependencies (if not already done)
  ```bash
  npm install
  ```

### 2. Get Required API Keys and Credentials

- [ ] **WalletConnect/Reown Project ID**
  - Visit: https://cloud.reown.com
  - Create a new project
  - Copy the Project ID

- [ ] **Base Sepolia RPC URL**
  - Use default: `https://sepolia.base.org`
  - Or get from: https://www.alchemy.com or https://infura.io

- [ ] **BaseScan API Key** (for contract verification)
  - Visit: https://basescan.org/myapikey
  - Create an account and get API key

- [ ] **Africa's Talking Credentials** (for SMS/USSD)
  - Visit: https://africastalking.com
  - Create sandbox account
  - Get API Key and Username

- [ ] **Storacha/IPFS Email**
  - Visit: https://web3.storage
  - Sign up with email
  - Email will be used for authentication

- [ ] **Wallet Private Key**
  - Create a new wallet for deployment
  - **NEVER use your main wallet!**
  - Export private key (keep it secret!)

### 3. Get Test ETH

- [ ] Get Sepolia ETH
  - Visit: https://sepoliafaucet.com
  - Request testnet ETH

- [ ] Bridge to Base Sepolia
  - Visit: https://bridge.base.org
  - Bridge Sepolia ETH to Base Sepolia

---

## 🔧 Configuration

### 1. Configure Contracts Environment

- [ ] Create `contracts/.env` file
  ```bash
  cd contracts
  cp .env.example .env
  ```

- [ ] Edit `contracts/.env` and add:
  ```env
  BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
  PRIVATE_KEY=your_wallet_private_key_here
  BASESCAN_API_KEY=your_basescan_api_key_here
  ```

### 2. Configure Backend Environment

- [ ] Create or update `backend/.env` file

- [ ] Add blockchain configuration:
  ```env
  BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
  HEALTH_VAULT_CONTRACT_ADDRESS=  # Will add after deployment
  ```

- [ ] Add IPFS configuration:
  ```env
  W3UP_EMAIL=your_email@example.com
  ```

- [ ] Add encryption key:
  ```env
  ENCRYPTION_KEY=your_32_character_or_longer_encryption_key_here
  ```

- [ ] Add Africa's Talking credentials:
  ```env
  AT_API_KEY=your_africastalking_api_key
  AT_USERNAME=your_africastalking_username
  AT_SHORTCODE=your_shortcode  # Optional
  ```

### 3. Configure Frontend Environment

- [ ] Create or update root `.env` file

- [ ] Add WalletConnect configuration:
  ```env
  VITE_REOWN_PROJECT_ID=your_walletconnect_project_id
  ```

- [ ] Add contract address (will update after deployment):
  ```env
  VITE_CONTRACT_ADDRESS=  # Will add after deployment
  ```

---

## 📝 Smart Contract Deployment

### 1. Compile Contracts

- [ ] Compile the smart contracts
  ```bash
  cd contracts
  npm run compile
  ```

- [ ] Verify compilation succeeded
  - Check for `artifacts/` directory
  - No compilation errors

### 2. Run Tests (Recommended)

- [ ] Run contract tests
  ```bash
  npm test
  ```

- [ ] Verify all tests pass (7/7 tests should pass)

### 3. Deploy to Base Sepolia

- [ ] Deploy the contract
  ```bash
  npm run deploy
  ```

- [ ] **SAVE THE CONTRACT ADDRESS!**
  - Copy the deployed contract address
  - You'll need this for the next steps

### 4. Copy ABI to Frontend and Backend

- [ ] Run the ABI copy script
  ```bash
  node scripts/copy-abi.js
  ```

- [ ] Verify ABI files created:
  - `src/contracts/HealthVault.json`
  - `backend/config/contracts/HealthVault.json`

### 5. Update Environment Variables

- [ ] Update `backend/.env`:
  ```env
  HEALTH_VAULT_CONTRACT_ADDRESS=0x_your_deployed_address
  ```

- [ ] Update root `.env`:
  ```env
  VITE_CONTRACT_ADDRESS=0x_your_deployed_address
  ```

### 6. Verify Contract (Optional)

- [ ] Verify on BaseScan
  ```bash
  cd contracts
  npx hardhat verify --network baseSepolia YOUR_CONTRACT_ADDRESS
  ```

---

## 🧪 Testing

### 1. Test Backend

- [ ] Start backend server
  ```bash
  cd backend
  npm start
  ```

- [ ] Check health endpoint
  ```bash
  curl http://localhost:3000/health
  ```

- [ ] Verify no configuration warnings

### 2. Test Frontend

- [ ] Start frontend
  ```bash
  npm run dev
  ```

- [ ] Connect wallet
- [ ] Test uploading a record
- [ ] Test viewing records
- [ ] Test access control

### 3. Test Blockchain Integration

- [ ] Upload a medical record
- [ ] Verify transaction on BaseScan
- [ ] Check record appears in blockchain
- [ ] Test access request flow
- [ ] Test access grant/revoke

---

## 🎯 Production Deployment (When Ready)

### Security Checklist

- [ ] Use hardware wallet or secure key management
- [ ] Never commit `.env` files
- [ ] Use environment variables in production
- [ ] Enable rate limiting
- [ ] Set up monitoring and alerts
- [ ] Audit smart contracts
- [ ] Test thoroughly on testnet first

### Deployment Steps

- [ ] Deploy to mainnet (Base)
- [ ] Verify contract on BaseScan
- [ ] Update all environment variables
- [ ] Deploy backend to production server
- [ ] Deploy frontend to hosting service
- [ ] Set up domain and SSL
- [ ] Configure Africa's Talking production credentials
- [ ] Test end-to-end in production

---

## 📚 Documentation

- [ ] Read `SMART_CONTRACTS_SETUP.md`
- [ ] Review `INTEGRATION_SUMMARY.md`
- [ ] Check `BLOCKCHAIN_INTEGRATION_COMPLETE.md`
- [ ] Review contract functions in `HealthVault.sol`

---

## 🆘 Troubleshooting

If you encounter issues, check:

1. **"Insufficient funds"** → Get more testnet ETH
2. **"Cannot connect to network"** → Check RPC URL
3. **"Contract not found"** → Verify contract address
4. **"Access denied"** → Check blockchain permissions
5. **"IPFS upload failed"** → Verify W3UP_EMAIL is set

---

**Good luck with your deployment! 🚀**

