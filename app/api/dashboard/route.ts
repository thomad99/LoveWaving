import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get active events
    const events = await prisma.event.findMany({
      where: {
        isActive: true,
      },
      include: {
        waiver: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { startDate: 'asc' },
    })

    // Get user's signed waivers (exclude signatureData to save memory)
    const signedWaivers = await prisma.waiverSignature.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        signedAt: true,
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            startDate: true,
            endDate: true,
            location: true,
            waiver: {
              select: {
                title: true,
              },
            },
          },
        },
        waiver: {
          select: {
            title: true,
          },
        },
        eventId: true,
      },
      orderBy: { signedAt: 'desc' },
    })

    return NextResponse.json({
      events,
      signedWaivers,
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

