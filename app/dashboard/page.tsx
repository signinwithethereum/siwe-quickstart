'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSiweAuth } from '@/hooks/useSiweAuth'
import { useEnsIdentity } from '@/hooks/useEnsIdentity'
import { truncateAddress } from '@/lib/format'

export default function Dashboard() {
  const router = useRouter()
  const { user, signOut } = useSiweAuth({
    onUserChange: (u) => {
      if (!u) router.push('/')
    },
  })
  const { ensName, ensAvatar } = useEnsIdentity(user)

  return (
    <main>
      <h1>Secret Dashboard</h1>
      {user && (
        <div className="card">
          {ensAvatar && (
            <Image
              src={ensAvatar}
              alt={ensName ?? user}
              width={64}
              height={64}
              unoptimized
              style={{ borderRadius: '50%' }}
            />
          )}
          <p>
            Signed in as <strong>{ensName ?? truncateAddress(user)}</strong>
          </p>
          <p className="address">{user}</p>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </main>
  )
}
