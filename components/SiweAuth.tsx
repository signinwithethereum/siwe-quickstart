'use client'

import { useConnection } from 'wagmi'
import { useMounted } from '@/hooks/useMounted'
import { useSiweAuth } from '@/hooks/useSiweAuth'
import { UserCard } from '@/components/UserCard'

export function SiweAuth() {
  const mounted = useMounted()
  const { isConnected } = useConnection()
  const { user, isLoading, error, signIn, signOut } = useSiweAuth()

  if (!mounted || !isConnected) return null

  if (user) {
    return <UserCard address={user} onSignOut={signOut} />
  }

  return (
    <div className="card">
      <button onClick={signIn} disabled={isLoading}>
        {isLoading ? 'Signing in\u2026' : 'Sign in with Ethereum'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
