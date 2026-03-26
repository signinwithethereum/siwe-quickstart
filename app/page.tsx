'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { SiweAuth } from '@/components/SiweAuth'

export default function Home() {
	return (
		<main>
			<h1>SIWE Demo</h1>
			<ConnectButton />
			<SiweAuth />
		</main>
	)
}
