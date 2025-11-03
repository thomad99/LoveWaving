import Link from 'next/link'
import Image from 'next/image'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignOutButton } from '@/components/auth/sign-out-button'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-2">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <Image src="/logo.png" alt="LoveWaving Logo" width={40} height={40} className="object-contain md:w-12 md:h-12" />
            <span className="text-xl md:text-2xl font-bold text-indigo-600">LoveWaving</span>
          </Link>
          <div className="flex gap-2 md:gap-4 flex-wrap">
            {session ? (
              <>
                <Link href={session.user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link href="/api/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
            Digital Waiver Management
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Streamline your event management with seamless digital waivers.
            Sign, track, and manage all your event documentation in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Easy Signing</CardTitle>
              <CardDescription>
                Multiple signature styles to choose from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Choose from 5 different signature styles. Your preference is saved for future use.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cloud Storage</CardTitle>
              <CardDescription>
                Secure document storage on AWS S3
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                All signed waivers are securely stored in the cloud with full audit trails.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>
                Full event and waiver management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Create events, upload waivers, and track completion rates with detailed analytics.
              </p>
            </CardContent>
          </Card>
        </div>

        {!session && (
          <div className="text-center">
            <Link href="/auth/signup">
              <Button size="lg">Get Started Free</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

