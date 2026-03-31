'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { SiweMessage } from '@signinwithethereum/siwe'
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSignMessage,
} from 'wagmi'
import Image from 'next/image'
import { mainnet } from 'wagmi/chains'

export function SiweAuth({
  onUserChange,
}: {
  onUserChange?: (user: string | null) => void
}) {
  const { address, chainId, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const [user, setUser] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const { data: ensName } = useEnsName({
    address: user as `0x${string}` | undefined,
    chainId: mainnet.id,
  })
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ?? undefined,
    chainId: mainnet.id,
  })

  // Check if already authenticated
  useEffect(() => {
    fetch('/api/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setUser(data.address)
          onUserChange?.(data.address)
        }
      })
  }, [onUserChange])

  const signIn = useCallback(async () => {
    if (!address || !chainId) return
    setIsLoading(true)

    try {
      setError(null)

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
        onUserChange?.(data.address)
      }
    } catch (err) {
      const e = err as { name?: string; code?: number; message?: string }
      const rejected =
        e.name === 'UserRejectedRequestError' ||
        e.code === 4001 ||
        e.message?.includes('reject')
      if (rejected) {
        setError('Signature rejected')
      } else if (e.message) {
        setError(e.message)
      } else {
        setError('Sign-in failed')
      }
    } finally {
      setIsLoading(false)
    }
  }, [address, chainId, signMessageAsync, onUserChange])

  const signOut = useCallback(async () => {
    await fetch('/api/logout', { method: 'POST' })
    setUser(null)
    onUserChange?.(null)
    disconnect()
  }, [disconnect, onUserChange])

  if (!mounted || !isConnected) return null

  if (user) {
    return (
      <div>
        {ensAvatar && (
          <Image
            src={ensAvatar}
            alt={ensName ?? user}
            width={48}
            height={48}
            unoptimized
            style={{ borderRadius: '50%' }}
          />
        )}
        <p>Signed in as {ensName ?? `${user.slice(0, 6)}…${user.slice(-4)}`}</p>
        <button onClick={signOut}>Sign out</button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={signIn}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in…' : 'Sign in with Ethereum'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
