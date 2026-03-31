'use client'

import Image from 'next/image'
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
  const { user, isLoading, error, signIn, signOut, isConnected } = useSiweAuth({
    onUserChange,
  })
  const { ensName, ensAvatar } = useEnsIdentity(user)

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
        <p>Signed in as {ensName ?? truncateAddress(user)}</p>
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
