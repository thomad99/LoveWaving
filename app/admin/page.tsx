import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EventsList } from '@/components/admin/events-list'
import { PlusIcon } from 'lucide-react'
import { SignOutButton } from '@/components/auth/sign-out-button'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/api/auth/signin?callbackUrl=/admin')
  }

  const events = await prisma.event.findMany({
    include: {
      waiver: true,
      _count: {
        select: { waiverSignatures: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const stats = await prisma.waiverSignature.aggregate({
    _count: true,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              LoveWaving
            </Link>
            <span className="text-sm text-gray-500">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your events and waivers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Events</CardDescription>
              <CardTitle className="text-3xl">{events.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Signatures</CardDescription>
              <CardTitle className="text-3xl">{stats._count}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Events</CardDescription>
              <CardTitle className="text-3xl">
                {events.filter(e => e.isActive).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Events</h2>
          <Link href="/admin/events/new">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>

        <EventsList events={events} />
      </main>
    </div>
  )
}

