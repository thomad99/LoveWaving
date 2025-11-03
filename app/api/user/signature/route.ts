import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { signatureData } = await req.json()

    if (!signatureData) {
      return NextResponse.json(
        { error: 'Signature data required' },
        { status: 400 }
      )
    }

    // Check if user already has a saved signature
    const existingSignature = await prisma.userSignature.findFirst({
      where: {
        userId: session.user.id,
        isDefault: true,
      },
    })

    if (existingSignature) {
      // Update existing signature
      await prisma.userSignature.update({
        where: { id: existingSignature.id },
        data: { signatureData },
      })
    } else {
      // Create new signature
      await prisma.userSignature.create({
        data: {
          userId: session.user.id,
          signatureData,
          isDefault: true,
        },
      })
    }

    return NextResponse.json({
      message: 'Signature saved successfully',
    })
  } catch (error) {
    console.error('Error saving signature:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

