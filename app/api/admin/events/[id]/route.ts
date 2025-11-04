import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3'

// Helper to extract region code from full region name
function getRegionCode(): string {
  const region = process.env.AWS_REGION || 'us-east-1'
  const match = region.match(/\b([a-z]{2}-[a-z]+-\d+)\b/i)
  return match ? match[1] : region
}

const s3Client = new S3Client({
  region: getRegionCode(),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!

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

    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        waiver: true,
        _count: {
          select: { waiverSignatures: true },
        },
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
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

    const body = await req.json()

    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        location: body.location,
        isActive: body.isActive,
      },
    })

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Get event details before deletion to find S3 files
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        waiver: {
          include: {
            signatures: {
              select: {
                s3Key: true,
              },
            },
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Collect all S3 keys to delete
    const s3KeysToDelete: string[] = []

    // Add waiver PDF if it exists
    if (event.waiver?.pdfUrl) {
      // Extract the S3 key from the URL or construct it
      // pdfUrl format: https://bucket.s3.region.amazonaws.com/waivers/{eventId}/{filename}
      const urlParts = event.waiver.pdfUrl.split('/')
      if (urlParts.length > 3) {
        const keyParts = urlParts.slice(3) // Remove https://bucket.s3.region.amazonaws.com/
        s3KeysToDelete.push(keyParts.join('/'))
      }
    }

    // Add all signed waiver PDFs
    if (event.waiver?.signatures) {
      event.waiver.signatures.forEach((signature: { s3Key: string }) => {
        if (signature.s3Key) {
          s3KeysToDelete.push(signature.s3Key)
        }
      })
    }

    // Delete S3 objects in batches (S3 allows up to 1000 objects per delete request)
    if (s3KeysToDelete.length > 0 && BUCKET_NAME) {
      try {
        // Delete in batches of 1000
        for (let i = 0; i < s3KeysToDelete.length; i += 1000) {
          const batch = s3KeysToDelete.slice(i, i + 1000)
          const deleteCommand = new DeleteObjectsCommand({
            Bucket: BUCKET_NAME,
            Delete: {
              Objects: batch.map((key) => ({ Key: key })),
              Quiet: true,
            },
          })
          await s3Client.send(deleteCommand)
        }
        console.log(`Deleted ${s3KeysToDelete.length} S3 objects for event ${params.id}`)
      } catch (s3Error) {
        console.error('Error deleting S3 objects:', s3Error)
        // Continue with database deletion even if S3 deletion fails
      }
    }

    // Delete the event (cascade will handle waiver and signatures)
    await prisma.event.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ 
      message: 'Event deleted successfully',
      deletedS3Files: s3KeysToDelete.length,
    })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}

