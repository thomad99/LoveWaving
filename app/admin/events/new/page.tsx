'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignOutButton } from '@/components/auth/sign-out-button'

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
  })

  const [waiverData, setWaiverData] = useState({
    title: '',
    content: '',
    file: null as File | null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      
      // Add event data
      Object.entries(eventData).forEach(([key, value]) => {
        formData.append(key, value)
      })

      // Add waiver data
      formData.append('waiverTitle', waiverData.title)
      formData.append('waiverContent', waiverData.content)
      if (waiverData.file) {
        formData.append('waiverFile', waiverData.file)
      }

      const response = await fetch('/api/admin/events', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create event')
      }

      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo.png" alt="LoveWaving Logo" width={48} height={48} className="object-contain" />
            <span className="text-2xl font-bold text-white">LoveWaving</span>
          </Link>
          <SignOutButton />
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="outline" className="mb-4">← Back</Button>
          </Link>
          <h1 className="text-4xl font-bold text-white">Create New Event</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
              <CardDescription>Provide details about your event</CardDescription>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={eventData.startDate}
                    onChange={(e) =>
                      setEventData({ ...eventData, startDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={eventData.endDate}
                    onChange={(e) =>
                      setEventData({ ...eventData, endDate: e.target.value })
                    }
                  />
                </div>
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
            </CardContent>
          </Card>

          {/* Waiver Details */}
          <Card>
            <CardHeader>
              <CardTitle>Waiver Form</CardTitle>
              <CardDescription>Upload a PDF or enter waiver text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="waiverTitle">Waiver Title *</Label>
                <Input
                  id="waiverTitle"
                  value={waiverData.title}
                  onChange={(e) =>
                    setWaiverData({ ...waiverData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waiverContent">Waiver Content</Label>
                <Textarea
                  id="waiverContent"
                  value={waiverData.content}
                  onChange={(e) =>
                    setWaiverData({ ...waiverData, content: e.target.value })
                  }
                  placeholder="Paste or type your waiver text here..."
                  rows={12}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waiverFile">Or Upload PDF/DOC</Label>
                <Input
                  id="waiverFile"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setWaiverData({
                      ...waiverData,
                      file: e.target.files?.[0] || null,
                    })
                  }
                />
                <p className="text-sm text-gray-500">
                  If you upload a file, it will be used instead of the text content.
                </p>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Link href="/admin">
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
