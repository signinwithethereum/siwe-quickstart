'use client'

import Link from 'next/link'
import { useConnection, useConnect, useConnectors } from 'wagmi'
import { SiweAuth } from '@/components/SiweAuth'
import { useMounted } from '@/hooks/useMounted'
import { useSiweAuth } from '@/hooks/useSiweAuth'

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
  const { user } = useSiweAuth()

  return (
    <main>
      <h1>SIWE Demo</h1>
      {user ? (
        <p>
          Welcome back &rarr; <Link href="/dashboard">Dashboard</Link>
        </p>
      ) : (
        <>
          <ConnectWallet />
          <SiweAuth />
        </>
      )}
    </main>
  )
}
