'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSiweAuth } from '@/hooks/useSiweAuth'

export function Nav() {
  const pathname = usePathname()
  const { user } = useSiweAuth()

  return (
    <nav>
      <Link href="/" className={pathname === '/' ? 'active' : ''}>
        Home
      </Link>
      {user && (
        <Link
          href="/dashboard"
          className={pathname === '/dashboard' ? 'active' : ''}
        >
          Dashboard
        </Link>
      )}
    </nav>
  )
}
