import { createRoot } from "react-dom/client";
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { wagmiAdapter, networks, metadata } from './config/wagmi'
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient()

// Get projectId from environment
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || 'YOUR_PROJECT_ID'

// Create AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#E95420', // Ubuntu orange
    '--w3m-color-mix': '#E95420',
    '--w3m-color-mix-strength': 20
  }
})

createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={wagmiAdapter.wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </WagmiProvider>
);
