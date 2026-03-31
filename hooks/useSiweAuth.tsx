'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { SiweMessage } from '@signinwithethereum/siwe'
import { useConnection, useDisconnect, useSignMessage } from 'wagmi'

interface SiweAuthState {
  user: string | null
  isLoading: boolean
  error: string | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const SiweAuthContext = createContext<SiweAuthState | null>(null)

export function SiweAuthProvider({ children }: { children: ReactNode }) {
  const { address, chainId } = useConnection()
  const { mutate: disconnect } = useDisconnect()
  const { mutateAsync: signMessageAsync } = useSignMessage()
  const [user, setUser] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasCheckedSession, setHasCheckedSession] = useState(false)
  const autoSignInAttempted = useRef<string | null>(null)
  const signedOut = useRef(false)
  const signInRef = useRef<() => void>(() => {})

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/me', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUser(data.address)
      })
      .catch(() => {})
      .finally(() => setHasCheckedSession(true))
    return () => controller.abort()
  }, [])

  const signIn = useCallback(async () => {
    if (!address || !chainId) return
    setIsLoading(true)

    try {
      setError(null)

      const nonceRes = await fetch('/api/nonce')
      const { nonce } = await nonceRes.json()

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
        issuedAt: new Date().toISOString(),
      })

      const messageString = message.prepareMessage()
      const signature = await signMessageAsync({ message: messageString })

      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageString, signature }),
      })

      if (res.ok) {
        const data = await res.json()
        setUser(data.address)
        signedOut.current = false
      }
    } catch (err) {
      const e = err as { name?: string; code?: number; message?: string }
      const rejected =
        e.name === 'UserRejectedRequestError' ||
        e.code === 4001 ||
        e.message?.includes('reject')
      if (rejected) {
        setError('Signature rejected')
      } else if (e.message) {
        setError(e.message)
      } else {
        setError('Sign-in failed')
      }
    } finally {
      setIsLoading(false)
    }
  }, [address, chainId, signMessageAsync])

  signInRef.current = signIn

  // Reset auto sign-in guard when wallet fully disconnects
  useEffect(() => {
    if (!address) {
      autoSignInAttempted.current = null
      signedOut.current = false
    }
  }, [address])

  // Auto sign-in when wallet connects and no existing session
  useEffect(() => {
    if (
      hasCheckedSession &&
      address &&
      chainId &&
      !user &&
      !isLoading &&
      !signedOut.current &&
      autoSignInAttempted.current !== address
    ) {
      autoSignInAttempted.current = address
      signInRef.current()
    }
  }, [hasCheckedSession, address, chainId, user, isLoading])

  const signOut = useCallback(async () => {
    signedOut.current = true
    await fetch('/api/logout', { method: 'POST' })
    setUser(null)
    disconnect()
  }, [disconnect])

  const value: SiweAuthState = { user, isLoading, error, signIn, signOut }

  return (
    <SiweAuthContext.Provider value={value}>
      {children}
    </SiweAuthContext.Provider>
  )
}

export function useSiweAuth(): SiweAuthState {
  const ctx = useContext(SiweAuthContext)
  if (!ctx) throw new Error('useSiweAuth must be used within SiweAuthProvider')
  return ctx
}
