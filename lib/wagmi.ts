import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || ''

// This app uses two separate RPC connections:
//
// 1. Server-side (ETH_RPC_URL in .env.local → lib/siwe.ts)
//    Used by the SIWE library to verify signatures and resolve ENS names on the backend.
//    This is a secret env var — never exposed to the browser.
//
// 2. Client-side (below — wagmi transports)
//    Used by wagmi in the browser for wallet interactions: reading balances, sending
//    transactions, estimating gas, etc. These env vars must be NEXT_PUBLIC_* prefixed
//    so Next.js bundles them into the client JS.
//
// They can point to the same provider (e.g. Alchemy) but are separate because:
// - Server keys should stay secret (higher rate limits, no abuse from browser exposure)
// - The frontend needs a NEXT_PUBLIC_* var so it's available in the browser bundle
// - When no frontend RPC is set, http() falls back to the chain's default public RPC

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_MAINNET_RPC_URL),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
  },
})
