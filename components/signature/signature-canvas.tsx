'use client'

import { useRef, useEffect } from 'react'
import SignatureCanvasComponent from 'react-signature-canvas'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface SignatureCanvasProps {
  selectedStyle: string
  signatureData: string
  onSignatureChange: (data: string) => void
}

export function SignatureCanvas({
  selectedStyle,
  signatureData,
  onSignatureChange,
}: SignatureCanvasProps) {
  const signaturePadRef = useRef<SignatureCanvasComponent>(null)

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear()
      onSignatureChange('')
    }
  }

  const handleEnd = () => {
    if (signaturePadRef.current) {
      // Use low quality JPEG to reduce file size (save 90% memory)
      const data = signaturePadRef.current.toDataURL('image/jpeg', 0.3)
      onSignatureChange(data)
    }
  }

  // Load saved signature into canvas when selectedStyle is 'custom'
  useEffect(() => {
    if (selectedStyle === 'custom' && signatureData && signaturePadRef.current) {
      const img = new Image()
      img.src = signatureData
      img.onload = () => {
        const ctx = signaturePadRef.current?.getCanvas()?.getContext('2d')
        if (ctx && signaturePadRef.current) {
          const canvas = signaturePadRef.current.getCanvas()
          if (canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)
          }
        }
      }
    }
  }, [selectedStyle, signatureData])

  const generateStyledSignature = () => {
    // Generate different signature styles programmatically
    const styles: Record<string, () => string> = {
      cursive: () => {
        // This would generate a cursive-style signature
        // For now, return a placeholder
        return 'Signature'
      },
      formal: () => {
        return 'SIGNATURE'
      },
      initial: () => {
        return 'SR'
      },
      stamp: () => {
        return '●'
      },
      mark: () => {
        return '×'
      },
    }

    return styles[selectedStyle]?.() || ''
  }

  if (selectedStyle === 'mark' || selectedStyle === 'stamp') {
    return (
      <div className="space-y-4">
        <div className="text-center text-4xl font-bold">
          {generateStyledSignature()}
        </div>
        <p className="text-sm text-gray-500 text-center">
          Click the button below to generate this signature type
        </p>
        <Button onClick={() => onSignatureChange(generateStyledSignature())} variant="outline" className="w-full">
          Use This Signature
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <SignatureCanvasComponent
            ref={signaturePadRef}
            canvasProps={{
              className: 'w-full border rounded cursor-crosshair',
              style: { height: '200px', touchAction: 'none' },
            }}
            backgroundColor="white"
            penColor="#1e40af"
            onEnd={handleEnd}
          />
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={!signatureData}
            >
              Clear
            </Button>
            {signatureData && (
              <p className="text-sm text-green-600 flex items-center">
                ✓ Signature captured
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
