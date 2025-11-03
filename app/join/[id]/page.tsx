'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function JoinEventPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [event, setEvent] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`)
        if (!response.ok) {
          throw new Error('Event not found')
        }
        const data = await response.json()
        setEvent(data.event)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id])

  const handleJoin = () => {
    router.push(`/events/${params.id}/sign`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Event Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This event could not be found. It may have been removed or the link is invalid.
            </p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            LoveWaving
          </Link>
          <Link href="/api/auth/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-3xl">{event.title}</CardTitle>
              {event.isActive ? (
                <Badge>Active</Badge>
              ) : (
                <Badge variant="secondary">Inactive</Badge>
              )}
            </div>
            <CardDescription className="text-lg">
              {event.description || 'Join this event and complete the waiver to participate'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.location && (
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium">
                {new Date(event.startDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {event.waiver && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Waiver Required</CardTitle>
              <CardDescription>
                A waiver must be completed to participate in this event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">{event.waiver.title}</p>
                {event.waiver.content && (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {event.waiver.content.substring(0, 200)}
                    {event.waiver.content.length > 200 ? '...' : ''}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-4">
          <Button 
            size="lg" 
            className="w-full text-lg py-6"
            onClick={handleJoin}
            disabled={!event.isActive}
          >
            {event.isActive ? 'Complete Waiver to Join' : 'Event is Inactive'}
          </Button>
          
          <p className="text-sm text-center text-gray-600">
            By joining, you agree to complete and sign the required waiver.
          </p>
        </div>

        <div className="mt-12 text-center text-sm text-gray-600">
          <p>Already have an account?</p>
          <Link href="/api/auth/signin" className="text-indigo-600 hover:underline">
            Sign in here
          </Link>
        </div>
      </main>
    </div>
  )
}

