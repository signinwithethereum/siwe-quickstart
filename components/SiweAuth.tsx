'use client'

import { useCallback, useEffect, useState } from 'react'
import { SiweMessage } from '@signinwithethereum/siwe'
import { useAccount, useSignMessage } from 'wagmi'

export function SiweAuth() {
	const { address, chainId, isConnected } = useAccount()
	const { signMessageAsync } = useSignMessage()
	const [user, setUser] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	// Check if already authenticated
	useEffect(() => {
		fetch('/api/me')
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => data && setUser(data.address))
	}, [])

	const signIn = useCallback(async () => {
		if (!address || !chainId) return
		setIsLoading(true)

		try {
			// 1. Fetch nonce from backend
			const nonceRes = await fetch('/api/nonce')
			const { nonce } = await nonceRes.json()

			// 2. Create SIWE message
			const message = new SiweMessage({
				domain: window.location.host,
				address,
				statement: 'Sign in with Ethereum.',
				uri: window.location.origin,
				version: '1',
				chainId,
				nonce,
				issuedAt: new Date().toISOString(),
			})

			const messageString = message.prepareMessage()

			// 3. Request wallet signature
			const signature = await signMessageAsync({ message: messageString })

			// 4. Verify on backend
			const res = await fetch('/api/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: messageString, signature }),
			})

			if (res.ok) {
				const data = await res.json()
				setUser(data.address)
			}
		} finally {
			setIsLoading(false)
		}
	}, [address, chainId, signMessageAsync])

	const signOut = useCallback(async () => {
		await fetch('/api/logout', { method: 'POST' })
		setUser(null)
	}, [])

	if (!isConnected) return null

	if (user) {
		return (
			<div>
				<p>Signed in as {user}</p>
				<button onClick={signOut}>Sign out</button>
			</div>
		)
	}

	return (
		<button onClick={signIn} disabled={isLoading}>
			{isLoading ? 'Signing in…' : 'Sign in with Ethereum'}
		</button>
	)
}
