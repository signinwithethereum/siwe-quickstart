'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { SiweAuth } from '@/components/SiweAuth'
import { useMounted } from '@/hooks/useMounted'
import { truncateAddress } from '@/lib/format'

function ConnectWallet({ hideDisconnect }: { hideDisconnect: boolean }) {
  const { isConnected, address } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const mounted = useMounted()

  if (!mounted) return null

  if (isConnected) {
    return (
      <div>
        <p>{address && truncateAddress(address)}</p>
        {!hideDisconnect && (
          <button onClick={() => disconnect()}>Disconnect</button>
        )}
      </div>
    )
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
        >
          {connector.name}
        </button>
      ))}
    </div>
  )
}

export default function Home() {
  const [siweUser, setSiweUser] = useState<string | null>(null)

  return (
    <main>
      <h1>SIWE Demo</h1>
      <ConnectWallet hideDisconnect={!!siweUser} />
      <SiweAuth onUserChange={setSiweUser} />
    </main>
  )
}
