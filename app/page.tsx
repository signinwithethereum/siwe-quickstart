'use client'

import Link from 'next/link'
import { useConnection, useConnect, useConnectors } from 'wagmi'
import { SiweAuth } from '@/components/SiweAuth'
import { FeatureCards } from '@/components/FeatureCards'
import { GitHubLinks } from '@/components/GitHubLinks'
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
      <p className="subtitle">
        A minimal{' '}
        <a href="https://siwe.xyz" target="_blank" rel="noopener noreferrer">
          Sign in with Ethereum
        </a>{' '}
        quickstart built with Next.js, Wagmi, and the{' '}
        <a
          href="https://github.com/signinwithethereum/siwe"
          target="_blank"
          rel="noopener noreferrer"
        >
          SIWE library
        </a>
        .
      </p>

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

      <hr className="separator" />

      <FeatureCards />

      <div className="centered">
        <GitHubLinks />
      </div>
    </main>
  )
}
