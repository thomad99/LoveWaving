'use client'

import { useState } from 'react'
import QRCodeSVG from 'react-qr-code'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Copy, Check } from 'lucide-react'

interface QRCodeComponentProps {
  eventId: string
  eventTitle: string
}

export function QRCodeComponent({ eventId, eventTitle }: QRCodeComponentProps) {
  const [copied, setCopied] = useState(false)
  
  // Create the URL that points to the public signup page
  const joinUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/join/${eventId}`
    : `https://lovewaving.onrender.com/join/${eventId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg')
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL('image/png')
        
        const downloadLink = document.createElement('a')
        downloadLink.download = `qr-code-${eventTitle.replace(/\s+/g, '-')}-${eventId}.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event QR Code</CardTitle>
        <CardDescription>
          Share this QR code to allow people to join and sign the waiver
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center bg-white p-4 rounded-lg border-2 border-gray-200">
          <QRCodeSVG
            id="qr-code-svg"
            value={joinUrl}
            size={200}
            level="M"
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-gray-600 text-center font-mono break-all">
            {joinUrl}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download QR
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

