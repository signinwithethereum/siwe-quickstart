import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || ''

export const config = createConfig({
	chains: [mainnet, sepolia],
	connectors: [
		injected(),
		...(projectId ? [walletConnect({ projectId })] : []),
	],
	transports: {
		[mainnet.id]: http(),
		[sepolia.id]: http(),
	},
})
