import React from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TransactionProvider } from 'ethereum-identity-kit'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'
import 'ethereum-identity-kit/css'
import './App.css'

import ProfileViewer from './components/ProfileViewer'

// Configure wagmi
const config = createConfig({
	chains: [mainnet],
	connectors: [
		injected(),
		metaMask(),
		// WalletConnect temporarily disabled to avoid connection errors
		// To enable: get a project ID from https://cloud.walletconnect.com
		walletConnect({ projectId: 'e726b061ac854a69790d01fa66c76401' }),
	],
	transports: {
		[mainnet.id]: http(),
	},
})

// Create query client with error handling
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 2,
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: 1,
		},
	},
})

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<WagmiProvider config={config}>
				<TransactionProvider>
					<div className='App'>
						<header className='App-header'>
							<h1>EFP Data Viewer</h1>
							<p>
								View Ethereum profiles using
								ethereum-identity-kit
							</p>
						</header>
						<main>
							<ProfileViewer />
						</main>
					</div>
				</TransactionProvider>
			</WagmiProvider>
		</QueryClientProvider>
	)
}

export default App
