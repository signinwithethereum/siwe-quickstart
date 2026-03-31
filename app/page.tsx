'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { SiweAuth } from '@/components/SiweAuth'

function ConnectWallet() {
	const { isConnected, address } = useAccount()
	const { connectors, connect } = useConnect()
	const { disconnect } = useDisconnect()
	const [mounted, setMounted] = useState(false)

	useEffect(() => setMounted(true), [])

	if (!mounted) return null

	if (isConnected) {
		return (
			<div>
				<p>{address?.slice(0, 6)}…{address?.slice(-4)}</p>
				<button onClick={() => disconnect()}>Disconnect</button>
			</div>
		)
	}

	return (
		<div>
			{connectors.map((connector) => (
				<button key={connector.uid} onClick={() => connect({ connector })}>
					{connector.name}
				</button>
			))}
		</div>
	)
}

export default function Home() {
	return (
		<main>
			<h1>SIWE Demo</h1>
			<ConnectWallet />
			<SiweAuth />
		</main>
	)
}
