import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export default async function UserDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/dashboard')
  }

  // Get active events
  const events = await prisma.event.findMany({
    where: {
      isActive: true,
    },
    include: {
      waiver: true,
    },
    orderBy: { startDate: 'asc' },
  })

  // Get user's signed waivers
  const signedWaivers = await prisma.waiverSignature.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      event: true,
      waiver: true,
    },
    orderBy: { signedAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            LoveWaving
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            {session.user.role === 'ADMIN' && (
              <Link href="/admin">
                <Button variant="outline" size="sm">Admin</Button>
              </Link>
            )}
            <Link href="/api/auth/signout">
              <Button variant="outline" size="sm">Sign Out</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>

        {signedWaivers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Signed Waivers</h2>
            <div className="space-y-4">
              {signedWaivers.map((ws) => (
                <Card key={ws.id}>
                  <CardHeader>
                    <CardTitle>{ws.event.title}</CardTitle>
                    <CardDescription>
                      Signed on {format(new Date(ws.signedAt), 'PPP')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge>{ws.waiver.title}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-semibold mb-4">Available Events</h2>
          {events.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  No active events at this time.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const isSigned = signedWaivers.some(ws => ws.eventId === event.id)
                return (
                  <Card key={event.id}>
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>
                        {format(new Date(event.startDate), 'PPP')}
                        {event.location && ` • ${event.location}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-4">
                          {event.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        {isSigned ? (
                          <Badge>Signed</Badge>
                        ) : (
                          <Link href={`/events/${event.id}/sign`}>
                            <Button>Sign Waiver</Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

