'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { Button } from '@/components/ui/button'

export function Header() {
  const { data: session } = useSession()

  return (
    <nav className="border-b bg-slate-900">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          {/* Logo - will be added from public folder */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 relative">
              {/* Placeholder - replace with actual logo */}
              <div className="w-full h-full bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">LW</span>
              </div>
            </div>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-white">{session.user.email}</span>
              {session.user.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-slate-900">
                    Admin
                  </Button>
                </Link>
              )}
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/api/auth/signin">
                <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-slate-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

