import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

// Helper to extract region code from full region name
function getRegionCode(): string {
  const region = process.env.AWS_REGION || 'us-east-1'
  const match = region.match(/\b([a-z]{2}-[a-z]+-\d+)\b/i)
  return match ? match[1] : region
}

export async function POST() {
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET_NAME) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'S3 credentials or bucket name not configured',
          details: {
            hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
            hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
            hasBucketName: !!process.env.AWS_S3_BUCKET_NAME,
          }
        },
        { status: 400 }
      )
    }

    const s3Client = new S3Client({
      region: getRegionCode(),
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })

    const bucketName = process.env.AWS_S3_BUCKET_NAME
    const testKey = `health-check/test-${Date.now()}.txt`
    const testContent = 'This is a test file from LoveWaving health check'

    // Step 1: Upload test file
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: testKey,
      Body: Buffer.from(testContent),
      ContentType: 'text/plain',
    })

    await s3Client.send(putCommand)

    // Step 2: Verify file exists
    const headCommand = new HeadObjectCommand({
      Bucket: bucketName,
      Key: testKey,
    })

    await s3Client.send(headCommand)

    // Step 3: Clean up - delete test file
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: testKey,
    })

    await s3Client.send(deleteCommand)

    return NextResponse.json({
      success: true,
      message: 'S3 upload, read, and delete test successful',
      details: {
        bucketName,
        region: getRegionCode(),
        testKey,
      },
    })
  } catch (error: any) {
    console.error('S3 test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
        details: {
          code: error.Code || error.code || 'Unknown',
          bucketName: process.env.AWS_S3_BUCKET_NAME || 'not configured',
          region: getRegionCode(),
        },
      },
      { status: 500 }
    )
  }
}
