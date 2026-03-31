import { useCallback, useEffect, useRef, useState } from 'react'
import { SiweMessage } from '@signinwithethereum/siwe'
import { useConnection, useDisconnect, useSignMessage } from 'wagmi'

interface UseSiweAuthOptions {
  onUserChange?: (user: string | null) => void
}

export function useSiweAuth(options?: UseSiweAuthOptions) {
  const { onUserChange } = options ?? {}
  const onUserChangeRef = useRef(onUserChange)
  onUserChangeRef.current = onUserChange
  const { address, chainId } = useConnection()
  const { mutate: disconnect } = useDisconnect()
  const { mutateAsync: signMessageAsync } = useSignMessage()
  const [user, setUser] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasCheckedSession, setHasCheckedSession] = useState(false)
  const autoSignInAttempted = useRef<string | null>(null)
  const signInRef = useRef<() => void>(() => {})

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/me', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setUser(data.address)
          onUserChangeRef.current?.(data.address)
        }
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
        onUserChangeRef.current?.(data.address)
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

  // Auto sign-in when wallet connects and no existing session
  useEffect(() => {
    if (
      hasCheckedSession &&
      address &&
      chainId &&
      !user &&
      !isLoading &&
      autoSignInAttempted.current !== address
    ) {
      autoSignInAttempted.current = address
      signInRef.current()
    }
  }, [hasCheckedSession, address, chainId, user, isLoading])

  const signOut = useCallback(async () => {
    await fetch('/api/logout', { method: 'POST' })
    setUser(null)
    onUserChangeRef.current?.(null)
    disconnect()
  }, [disconnect])

  return { user, isLoading, error, signIn, signOut }
}
