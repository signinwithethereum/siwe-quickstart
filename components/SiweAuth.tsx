'use client'

import Image from 'next/image'
import { useConnection } from 'wagmi'
import { useMounted } from '@/hooks/useMounted'
import { useSiweAuth } from '@/hooks/useSiweAuth'
import { useEnsIdentity } from '@/hooks/useEnsIdentity'
import { truncateAddress } from '@/lib/format'

export function SiweAuth({
  onUserChange,
}: {
  onUserChange?: (user: string | null) => void
}) {
  const mounted = useMounted()
  const { isConnected } = useConnection()
  const { user, isLoading, error, signIn, signOut } = useSiweAuth({
    onUserChange,
  })
  const { ensName, ensAvatar } = useEnsIdentity(user)

  if (!mounted || !isConnected) return null

  if (user) {
    return (
      <div className="card">
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
        <p>Signed in as <strong>{ensName ?? truncateAddress(user)}</strong></p>
        <p className="address">{user}</p>
        <button onClick={signOut}>Sign out</button>
      </div>
    )
  }

  return (
    <div className="card">
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
