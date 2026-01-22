# WalletConnect Integration Guide

This document explains the WalletConnect (Reown AppKit) integration in Ubuntu Health Vault.

## 🔧 What Was Added

### 1. **Dependencies Installed**
- `@reown/appkit` - The main AppKit library (formerly WalletConnect)
- `@reown/appkit-adapter-wagmi` - Wagmi adapter for AppKit
- `wagmi` - React hooks for Ethereum
- `viem` - TypeScript interface for Ethereum

### 2. **Configuration Files**

#### `src/config/wagmi.ts`
- Configures WagmiAdapter with Base Sepolia network
- Sets up project metadata
- Exports wagmi config for use throughout the app

#### `.env.example`
- Template for environment variables
- Includes `VITE_REOWN_PROJECT_ID` for your Reown project

### 3. **Components Created**

#### `src/components/ConnectButton.tsx`
- Reusable wallet connection button
- Shows wallet address when connected
- Uses Ubuntu Health Vault styling

### 4. **Provider Setup**

#### `src/main.tsx`
- Wraps app with `WagmiProvider` and `QueryClientProvider`
- Initializes AppKit modal with custom Ubuntu orange theme
- Configures dark mode and theme variables

### 5. **Pages Updated**

#### `src/pages/PatientDashboard.tsx`
- Added wallet connection requirement
- Shows connection prompt if wallet not connected
- Displays wallet address in header

#### `src/pages/DoctorDashboard.tsx`
- Added wallet connection requirement
- Shows connection prompt if wallet not connected
- Displays wallet address in header

#### `src/components/HeroSection.tsx`
- Added ConnectButton to navigation
- Available on both desktop and mobile views

## 🚀 Getting Started

### Step 1: Get Your Reown Project ID

1. Visit [https://cloud.reown.com](https://cloud.reown.com)
2. Create a new project
3. Copy your Project ID

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Reown Project ID:

```env
VITE_REOWN_PROJECT_ID=your_actual_project_id_here
```

### Step 3: Install Dependencies (Already Done)

The following packages have been installed:
```bash
npm install @reown/appkit @reown/appkit-adapter-wagmi wagmi viem
```

### Step 4: Run the Application

```bash
npm run dev
```

## 🎨 Theme Customization

The WalletConnect modal is themed with Ubuntu orange (#E95420):

```typescript
themeVariables: {
  '--w3m-accent': '#E95420',
  '--w3m-color-mix': '#E95420',
  '--w3m-color-mix-strength': 20
}
```

## 🔐 How It Works

1. **User clicks "Connect Wallet"** - Opens the AppKit modal
2. **User selects wallet** - MetaMask, WalletConnect, Coinbase Wallet, etc.
3. **Wallet connects** - User's address is stored in app state
4. **Access granted** - User can now access Patient or Doctor portals
5. **Wallet displayed** - Shortened address shown in header (e.g., 0x1234...5678)

## 📱 Supported Wallets

- MetaMask
- WalletConnect (mobile wallets)
- Coinbase Wallet
- Trust Wallet
- Rainbow Wallet
- And many more...

## 🌐 Network Configuration

Currently configured for **Base Sepolia** testnet:
- Network: Base Sepolia
- Chain ID: 84532
- RPC: Provided by Reown

To add more networks, edit `src/config/wagmi.ts`:

```typescript
import { baseSepolia, base } from '@reown/appkit/networks'

export const networks = [baseSepolia, base]
```

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Keep your Reown Project ID secure
- The wallet connection is client-side only
- No private keys are ever stored or transmitted

## 📚 Additional Resources

- [Reown AppKit Documentation](https://docs.reown.com/appkit/overview)
- [Wagmi Documentation](https://wagmi.sh)
- [Base Network Documentation](https://docs.base.org)

## 🐛 Troubleshooting

### "Project ID not found" error
- Make sure you've created a `.env` file
- Verify your `VITE_REOWN_PROJECT_ID` is correct
- Restart the dev server after adding environment variables

### Wallet not connecting
- Check that you're on the correct network (Base Sepolia)
- Make sure your wallet extension is installed and unlocked
- Try refreshing the page

### Theme not applying
- Clear browser cache
- Check browser console for errors
- Verify theme variables in `src/main.tsx`

