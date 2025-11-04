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
    <div className="min-h-screen bg-slate-900">
      <nav className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-2">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <Image src="/logo.png" alt="LoveWaving Logo" width={96} height={96} className="object-contain" />
            <span className="text-xl md:text-2xl font-bold text-white">LoveWaving</span>
          </Link>
          <div className="flex gap-2 md:gap-4 flex-wrap">
            {session ? (
              <>
                <Link href={session.user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                  <Button variant="ghost" className="text-white hover:bg-slate-800">Dashboard</Button>
                </Link>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link href="/api/auth/signin">
                  <Button variant="ghost" className="text-white hover:bg-slate-800">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Digital Waiver Management
          </h2>
          <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Streamline your event management with seamless digital waivers.
            Sign, track, and manage all your event documentation in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-white">Easy Signing</CardTitle>
              <CardDescription className="text-gray-300">
                Multiple signature styles to choose from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Choose from 5 different signature styles. Your preference is saved for future use.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-white">Cloud Storage</CardTitle>
              <CardDescription className="text-gray-300">
                Secure document storage on AWS S3
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                All signed waivers are securely stored in the cloud with full audit trails.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-white">Admin Dashboard</CardTitle>
              <CardDescription className="text-gray-300">
                Full event and waiver management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
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

