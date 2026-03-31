'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useConnection, useConnect, useConnectors } from 'wagmi'
import { SiweAuth } from '@/components/SiweAuth'
import { useMounted } from '@/hooks/useMounted'

function ConnectWallet() {
  const { isConnected } = useConnection()
  const connectors = useConnectors()
  const { mutate: connect, isPending, variables } = useConnect()
  const mounted = useMounted()

  if (!mounted || isConnected) return null

  return (
    <div className="card">
      <p className="card-label">Connect a wallet</p>
      <div className="connectors">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
          >
            {isPending && variables?.connector === connector
              ? 'Connecting…'
              : connector.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [siweUser, setSiweUser] = useState<string | null>(null)

  return (
    <main>
      <h1>SIWE Demo</h1>
      {siweUser ? (
        <p>Welcome back &rarr; <Link href="/dashboard">Dashboard</Link></p>
      ) : (
        <>
          <ConnectWallet />
          <SiweAuth onUserChange={setSiweUser} />
        </>
      )}
    </main>
  )
}
