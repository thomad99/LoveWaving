import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSignedWaiverUrl } from '@/lib/s3'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const signatureId = params.id

    // Get the signature with S3 key
    const signature = await prisma.waiverSignature.findUnique({
      where: { id: signatureId },
      select: {
        s3Key: true,
      },
    })

    if (!signature || !signature.s3Key) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Generate a signed URL from S3
    const signedUrl = await getSignedWaiverUrl(signature.s3Key)

    return NextResponse.json({
      url: signedUrl,
    })
  } catch (error) {
    console.error('Error generating signed URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate document URL' },
      { status: 500 }
    )
  }
}

