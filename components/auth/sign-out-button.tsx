'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface SignOutButtonProps {
  size?: 'sm' | 'default'
}

export function SignOutButton({ size }: SignOutButtonProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
    router.refresh()
  }

  return (
    <Button variant="outline" size={size} onClick={handleSignOut}>
      Sign Out
    </Button>
  )
}

