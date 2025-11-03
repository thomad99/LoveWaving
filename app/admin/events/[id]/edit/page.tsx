'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDate: '',
    location: '',
    isActive: false,
  })

  const loadEvent = async () => {
    try {
      const response = await fetch(`/api/admin/events/${params.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      const event = data.event
      setEventData({
        title: event.title,
        description: event.description || '',
        startDate: new Date(event.startDate).toISOString().slice(0, 10),
        location: event.location || '',
        isActive: event.isActive,
      })
      setLoading(false)
    } catch (error) {
      console.error('Error loading event:', error)
      alert('Failed to load event')
      router.push('/admin')
    }
  }

  useEffect(() => {
    loadEvent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/events/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      router.push(`/admin/events/${params.id}`)
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Failed to update event')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-2xl font-bold text-indigo-600">
            LoveWaving
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/admin/events/${params.id}`}>
              <Button variant="outline">← Back</Button>
            </Link>
            <h1 className="text-4xl font-bold">Edit Event</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={eventData.title}
                  onChange={(e) =>
                    setEventData({ ...eventData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={eventData.description}
                  onChange={(e) =>
                    setEventData({ ...eventData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={eventData.startDate}
                  onChange={(e) =>
                    setEventData({ ...eventData, startDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={eventData.location}
                  onChange={(e) =>
                    setEventData({ ...eventData, location: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={eventData.isActive}
                  onChange={(e) =>
                    setEventData({ ...eventData, isActive: e.target.checked })
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="isActive">Event is active</Label>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex gap-4">
            <Link href={`/admin/events/${params.id}`}>
              <Button type="button" variant="outline" disabled={saving}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

