import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
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

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        waiver: true,
      },
    })

    if (!event || !event.isActive) {
      return NextResponse.json(
        { error: 'Event not found or inactive' },
        { status: 404 }
      )
    }

    if (!event.waiver) {
      return NextResponse.json(
        { error: 'No waiver attached to this event' },
        { status: 404 }
      )
    }

    // Check if user has already signed
    const existingSignature = await prisma.waiverSignature.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: event.id,
        },
      },
    })

    // Load saved signature for the user
    const savedSignature = await prisma.userSignature.findFirst({
      where: {
        userId: session.user.id,
        isDefault: true,
      },
    })

    return NextResponse.json({
      event,
      waiver: event.waiver,
      hasSigned: !!existingSignature,
      savedSignature,
    })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

