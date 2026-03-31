'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { SiweAuth } from '@/components/SiweAuth'

function ConnectWallet({ hideDisconnect }: { hideDisconnect: boolean }) {
  const { isConnected, address } = useAccount()
  const { connectors, connectAsync } = useConnect()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  if (isConnected) {
    return (
      <div>
        <p>
          {address?.slice(0, 6)}…{address?.slice(-4)}
        </p>
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
          onClick={() => connectAsync({ connector }).catch(() => {})}
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
