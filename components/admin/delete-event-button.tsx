'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2, AlertTriangle } from 'lucide-react'

interface DeleteEventButtonProps {
  eventId: string
  eventTitle?: string
}

export function DeleteEventButton({ eventId, eventTitle }: DeleteEventButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete event')
      }

      // Success - redirect to admin page
      router.push('/admin')
      router.refresh() // Refresh to update the list
    } catch (error) {
      console.error('Error deleting event:', error)
      alert(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setLoading(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="space-y-4 p-4 border border-red-200 bg-red-50 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 mb-1">Confirm Deletion</h3>
            <p className="text-sm text-red-700 mb-4">
              Are you sure you want to delete this event?{eventTitle && ` "${eventTitle}"`}
              <br />
              <strong>This action cannot be undone.</strong> This will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>The event and all its details</li>
                <li>The associated waiver form</li>
                <li>All signed waivers and signatures</li>
                <li>All related files stored in S3</li>
              </ul>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Deleting...' : 'Yes, Delete Event'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowConfirm(false)
              setLoading(false)
            }}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button
      variant="destructive"
      onClick={() => setShowConfirm(true)}
      className="w-full"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Delete Event
    </Button>
  )
}
