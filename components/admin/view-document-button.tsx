'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ViewDocumentButtonProps {
  signatureId: string
}

export function ViewDocumentButton({ signatureId }: ViewDocumentButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleViewDocument = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/signed-waivers/${signatureId}`)
      const data = await response.json()
      if (data.url) {
        window.open(data.url, '_blank')
      } else {
        alert('Document not available')
      }
    } catch (error) {
      console.error('Error fetching document:', error)
      alert('Failed to load document')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleViewDocument}
      disabled={loading}
    >
      {loading ? 'Loading...' : 'View Document'}
    </Button>
  )
}

