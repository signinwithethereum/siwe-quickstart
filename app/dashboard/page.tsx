'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSiweAuth } from '@/hooks/useSiweAuth'
import { UserCard } from '@/components/UserCard'

export default function Dashboard() {
  const router = useRouter()
  const { user, signOut } = useSiweAuth()

  useEffect(() => {
    if (!user) router.push('/')
  }, [user, router])

  return (
    <main>
      <h1>Secret Dashboard</h1>
      {user && <UserCard address={user} avatarSize={64} onSignOut={signOut} />}
    </main>
  )
}
