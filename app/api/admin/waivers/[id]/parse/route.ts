import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parsePDFForm } from '@/lib/pdf-parser'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

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

    const waiverId = params.id

    // Get the waiver with PDF URL
    const waiver = await prisma.waiver.findUnique({
      where: { id: waiverId },
      select: {
        id: true,
        title: true,
        pdfUrl: true,
      },
    })

    if (!waiver || !waiver.pdfUrl) {
      return NextResponse.json(
        { error: 'Waiver not found or no PDF attached' },
        { status: 404 }
      )
    }

    // Extract S3 key from URL
    const urlMatch = waiver.pdfUrl.match(/waivers\/.+/)
    if (!urlMatch) {
      return NextResponse.json(
        { error: 'Invalid PDF URL' },
        { status: 400 }
      )
    }

    const s3Key = urlMatch[0]

    // Download PDF from S3
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    })

    const response = await s3Client.send(command)
    
    if (!response.Body) {
      return NextResponse.json(
        { error: 'Failed to download PDF' },
        { status: 500 }
      )
    }

    // Convert stream to buffer
    const pdfBuffer = Buffer.from(await response.Body.transformToByteArray())

    // Parse PDF for form fields
    const formFields = await parsePDFForm(pdfBuffer)

    return NextResponse.json({
      fields: formFields,
    })
  } catch (error) {
    console.error('Error parsing PDF:', error)
    return NextResponse.json(
      { error: 'Failed to parse PDF' },
      { status: 500 }
    )
  }
}

