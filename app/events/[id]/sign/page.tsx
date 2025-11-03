'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignatureCanvas } from '@/components/signature/signature-canvas'
import { SignatureStyleSelector } from '@/components/signature/signature-style-selector'

// Signature styles
const SIGNATURE_STYLES = [
  { id: 'cursive', name: 'Cursive', preview: 'Signature' },
  { id: 'formal', name: 'Formal', preview: 'SIGNATURE' },
  { id: 'initial', name: 'Initials', preview: 'SR' },
  { id: 'stamp', name: 'Stamp', preview: '●' },
  { id: 'mark', name: 'Mark', preview: '×' },
]

export default function SignEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(false)
  const [event, setEvent] = useState<any>(null)
  const [waiver, setWaiver] = useState<any>(null)
  const [selectedStyle, setSelectedStyle] = useState('cursive')
  const [signatureData, setSignatureData] = useState('')
  const [hasSigned, setHasSigned] = useState(false)

  const loadEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setEvent(data.event)
      setWaiver(data.waiver)
      setHasSigned(data.hasSigned)
      
      // Load saved signature if available
      if (data.savedSignature) {
        setSignatureData(data.savedSignature.signatureData)
        setSelectedStyle('custom') // Mark as custom saved signature
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading event:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      signIn('credentials', { callbackUrl: `/events/${params.id}/sign` })
      return
    }

    loadEvent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, params.id])

  const handleSign = async () => {
    if (!signatureData) {
      alert('Please provide a signature')
      return
    }

    setSigning(true)

    try {
      const response = await fetch(`/api/events/${params.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureStyle: selectedStyle,
          signatureData,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error signing waiver:', error)
      alert('Failed to sign waiver. Please try again.')
      setSigning(false)
    }
  }

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

  if (hasSigned) {
    return (
      <div className="min-h-screen bg-slate-900">
        <nav className="border-b border-slate-800">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="LoveWaving Logo" width={48} height={48} className="object-contain" />
              <span className="text-2xl font-bold text-white">LoveWaving</span>
            </Link>
          </div>
        </nav>
        <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Already Signed</CardTitle>
              <CardDescription>
                You have already signed the waiver for this event.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/dashboard')} className="w-full">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!event || !waiver) {
    return (
      <div className="min-h-screen bg-slate-900">
        <nav className="border-b border-slate-800">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="LoveWaving Logo" width={48} height={48} className="object-contain" />
              <span className="text-2xl font-bold text-white">LoveWaving</span>
            </Link>
          </div>
        </nav>
        <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Not Found</CardTitle>
              <CardDescription>This event could not be found.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/dashboard')} className="w-full">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="LoveWaving Logo" width={48} height={48} className="object-contain" />
            <span className="text-2xl font-bold text-indigo-600">LoveWaving</span>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
          <p className="text-gray-600">Sign the waiver to attend</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{waiver.title}</CardTitle>
              <CardDescription>Please review the waiver below and complete all required information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {waiver.pdfUrl ? (
                  <div className="border rounded overflow-hidden">
                    <iframe
                      src={waiver.pdfUrl}
                      className="w-full h-[600px] md:h-[800px] border-0"
                      title="Waiver Document"
                    />
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap text-gray-700 max-h-[600px] overflow-y-auto">
                    {waiver.content}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Signature</CardTitle>
              <CardDescription>
                Choose your signature style and sign below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SignatureStyleSelector
                styles={SIGNATURE_STYLES}
                selectedStyle={selectedStyle}
                onSelect={setSelectedStyle}
              />

              <SignatureCanvas
                selectedStyle={selectedStyle}
                signatureData={signatureData}
                onSignatureChange={setSignatureData}
              />

              <Button
                onClick={handleSign}
                disabled={!signatureData || signing}
                className="w-full"
                size="lg"
              >
                {signing ? 'Signing...' : 'Sign & Submit'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

