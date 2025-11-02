import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadSignedWaiver } from '@/lib/s3'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const eventId = params.id
    const { signatureStyle, signatureData } = await req.json()

    if (!signatureData || !signatureStyle) {
      return NextResponse.json(
        { error: 'Missing signature data' },
        { status: 400 }
      )
    }

    // Verify event exists and has a waiver
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { waiver: true },
    })

    if (!event || !event.isActive) {
      return NextResponse.json(
        { error: 'Event not found or inactive' },
        { status: 404 }
      )
    }

    if (!event.waiver) {
      return NextResponse.json(
        { error: 'No waiver attached' },
        { status: 404 }
      )
    }

    // Check if already signed
    const existingSignature = await prisma.waiverSignature.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: event.id,
        },
      },
    })

    if (existingSignature) {
      return NextResponse.json(
        { error: 'Already signed' },
        { status: 400 }
      )
    }

    // Save signature to database first
    const waiverSignature = await prisma.waiverSignature.create({
      data: {
        userId: session.user.id,
        eventId: event.id,
        waiverId: event.waiver.id,
        signatureStyle,
        signatureData,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
        userAgent: req.headers.get('user-agent') || undefined,
        s3Key: '', // Will be updated after S3 upload
      },
    })

    // Generate PDF with signature
    // TODO: Implement PDF generation with signature
    // For now, we'll create a placeholder
    const pdfBuffer = Buffer.from('placeholder-pdf-content')
    const s3Key = `signed-waivers/${eventId}/${session.user.id}/${waiverSignature.id}.pdf`

    try {
      // Upload to S3
      await uploadSignedWaiver(pdfBuffer, s3Key)

      // Update with S3 key
      await prisma.waiverSignature.update({
        where: { id: waiverSignature.id },
        data: { s3Key },
      })
    } catch (s3Error) {
      console.error('S3 upload error:', s3Error)
      // Don't fail the whole request if S3 fails
    }

    // Check if user has saved signatures
    const savedSignature = await prisma.userSignature.findFirst({
      where: { userId: session.user.id },
    })

    // If no saved signature, save this one
    if (!savedSignature && signatureStyle !== 'mark' && signatureStyle !== 'stamp') {
      await prisma.userSignature.create({
        data: {
          userId: session.user.id,
          signatureData,
          isDefault: true,
        },
      })
    }

    return NextResponse.json({
      success: true,
      signatureId: waiverSignature.id,
    })
  } catch (error) {
    console.error('Error signing waiver:', error)
    return NextResponse.json(
      { error: 'Failed to sign waiver' },
      { status: 500 }
    )
  }
}

