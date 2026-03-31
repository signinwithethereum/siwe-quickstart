'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Nav() {
  const pathname = usePathname()
  const [user, setUser] = useState<string | null>(null)

  const checkSession = () => {
    fetch('/api/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.address ?? null))
      .catch(() => setUser(null))
  }

  useEffect(checkSession, [pathname])

  useEffect(() => {
    window.addEventListener('siwe-auth-change', checkSession)
    return () => window.removeEventListener('siwe-auth-change', checkSession)
  }, [])

  return (
    <nav>
      <Link href="/" className={pathname === '/' ? 'active' : ''}>
        Home
      </Link>
      {user && (
        <Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>
          Dashboard
        </Link>
      )}
    </nav>
  )
}
