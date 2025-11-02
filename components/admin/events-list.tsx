'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

interface Event {
  id: string
  title: string
  description: string | null
  startDate: Date
  endDate: Date | null
  location: string | null
  isActive: boolean
  waiver: {
    id: string
    title: string
  } | null
  _count: {
    waiverSignatures: number
  }
}

interface EventsListProps {
  events: Event[]
}

export function EventsList({ events }: EventsListProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">
            No events yet. Create your first event to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {event.title}
                  {event.isActive ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {format(new Date(event.startDate), 'PPP')}
                  {event.location && ` • ${event.location}`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{event.description}</p>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {event.waiver ? (
                  <span>Waiver: {event.waiver.title}</span>
                ) : (
                  <span className="text-yellow-600">No waiver attached</span>
                )}
                <span className="mx-2">•</span>
                <span>{event._count.waiverSignatures} signatures</span>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/events/${event.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
                <Link href={`/admin/events/${event.id}/edit`}>
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

