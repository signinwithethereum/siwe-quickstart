'use client'

import Image from 'next/image'
import { useEnsIdentity } from '@/hooks/useEnsIdentity'
import { truncateAddress } from '@/lib/format'

export function UserCard({
  address,
  avatarSize = 48,
  onSignOut,
}: {
  address: string
  avatarSize?: number
  onSignOut: () => void
}) {
  const { ensName, ensAvatar } = useEnsIdentity(address)

  return (
    <div className="card">
      {ensAvatar && (
        <Image
          src={ensAvatar}
          alt={ensName ?? address}
          width={avatarSize}
          height={avatarSize}
          unoptimized
          style={{ borderRadius: '50%' }}
        />
      )}
      <p>
        Signed in as <strong>{ensName ?? truncateAddress(address)}</strong>
      </p>
      <p className="address">{address}</p>
      <button onClick={onSignOut}>Sign out</button>
    </div>
  )
}
