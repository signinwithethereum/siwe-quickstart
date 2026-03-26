import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, sepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
	appName: 'SIWE App',
	projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'YOUR_PROJECT_ID',
	chains: [mainnet, sepolia],
})
