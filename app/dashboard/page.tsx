'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { SignOutButton } from '@/components/auth/sign-out-button'

interface Event {
  id: string
  title: string
  description: string | null
  startDate: string
  endDate: string | null
  location: string | null
  waiver: {
    title: string
  } | null
}

interface SignedWaiver {
  id: string
  signedAt: string
  event: Event
  waiver: {
    title: string
  }
  eventId: string
}

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<Event[]>([])
  const [signedWaivers, setSignedWaivers] = useState<SignedWaiver[]>([])
  
  // Filter states
  const [searchText, setSearchText] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterLocation, setFilterLocation] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    loadDashboardData()
  }, [status])

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setEvents(data.events)
      setSignedWaivers(data.signedWaivers)
      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard:', error)
      setLoading(false)
    }
  }

  // Get unique locations from events
  const locations = Array.from(new Set(events.map(e => e.location).filter(Boolean)))

  // Filter events
  const filteredEvents = events.filter(event => {
    // Exclude already signed events
    const isSigned = signedWaivers.some(ws => ws.eventId === event.id)
    if (isSigned) return false

    // Apply filters
    const matchesSearch = !searchText || 
      event.title.toLowerCase().includes(searchText.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchText.toLowerCase())
    
    const matchesDate = !filterDate || 
      format(new Date(event.startDate), 'yyyy-MM-dd') === filterDate
    
    const matchesLocation = !filterLocation || 
      event.location === filterLocation

    return matchesSearch && matchesDate && matchesLocation
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="LoveWaving Logo" width={48} height={48} className="object-contain" />
            <span className="text-2xl font-bold text-white">LoveWaving</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800">Profile</Button>
            </Link>
            {session?.user.role === 'ADMIN' && (
              <Link href="/admin">
                <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-slate-900">Admin</Button>
              </Link>
            )}
            <SignOutButton size="sm" />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-white">My Dashboard</h1>

        {signedWaivers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">Signed Waivers</h2>
            <div className="space-y-4">
              {signedWaivers.map((ws) => (
                <Card key={ws.id}>
                  <CardHeader>
                    <CardTitle>{ws.event.title}</CardTitle>
                    <CardDescription>
                      Event Date: {format(new Date(ws.event.startDate), 'PPP')}
                      {' • '}
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
          <h2 className="text-2xl font-semibold mb-4 text-white">Available Events</h2>
          
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Search</label>
                  <Input
                    type="text"
                    placeholder="Search events..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
              {(searchText || filterDate || filterLocation) && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchText('')
                      setFilterDate('')
                      setFilterLocation('')
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  {events.length === 0 
                    ? 'No active events at this time.' 
                    : 'No events match your filters.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
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
                      <Link href={`/events/${event.id}/sign`}>
                        <Button>Sign Waiver</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
