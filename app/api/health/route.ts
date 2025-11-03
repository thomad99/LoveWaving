import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { S3Client, ListObjectsV2Command, HeadBucketCommand } from '@aws-sdk/client-s3'

// Helper to extract region code from full region name
function getRegionCode(): string {
  const region = process.env.AWS_REGION || 'us-east-1'
  const match = region.match(/\b([a-z]{2}-[a-z]+-\d+)\b/i)
  return match ? match[1] : region
}

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {
      database: {
        status: 'unknown',
        connected: false,
        error: null as string | null,
        stats: {},
      },
      s3: {
        status: 'unknown',
        accessible: false,
        error: null as string | null,
        stats: {
          bucketName: process.env.AWS_S3_BUCKET_NAME || 'not configured',
          region: getRegionCode(),
          configured: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_S3_BUCKET_NAME),
          documentCount: 0,
        },
      },
    },
  }

  // Test Database Connection
  try {
    const userCount = await prisma.user.count()
    const eventCount = await prisma.event.count()
    const waiverCount = await prisma.waiver.count()
    const signatureCount = await prisma.waiverSignature.count()
    const activeEvents = await prisma.event.count({ where: { isActive: true } })
    const adminUsers = await prisma.user.count({ where: { role: 'ADMIN' } })
    
    const recentSignatures = await prisma.waiverSignature.count({
      where: {
        signedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    })

    health.checks.database = {
      status: 'ok',
      connected: true,
      error: null,
      stats: {
        totalUsers: userCount,
        totalEvents: eventCount,
        totalWaivers: waiverCount,
        totalSignatures: signatureCount,
        activeEvents,
        recentSignatures24h: recentSignatures,
        adminUsers,
      },
    }
  } catch (error: any) {
    health.checks.database = {
      status: 'error',
      connected: false,
      error: error.message,
      stats: {},
    }
    health.status = 'degraded'
  }

  // Test S3 Connection
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET_NAME) {
      throw new Error('S3 credentials or bucket name not configured')
    }

    const s3Client = new S3Client({
      region: getRegionCode(),
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })

    // Test bucket access
    const headCommand = new HeadBucketCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
    })
    await s3Client.send(headCommand)

    // Count objects in the bucket (limit to first 1000)
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      MaxKeys: 1000,
    })
    const listResponse = await s3Client.send(listCommand)
    const documentCount = listResponse.KeyCount || 0

    health.checks.s3 = {
      status: 'ok',
      accessible: true,
      error: null,
      stats: {
        bucketName: process.env.AWS_S3_BUCKET_NAME,
        region: getRegionCode(),
        configured: true,
        documentCount,
      },
    }
  } catch (error: any) {
    health.checks.s3 = {
      status: 'error',
      accessible: false,
      error: error.message,
      stats: {
        bucketName: process.env.AWS_S3_BUCKET_NAME || 'not configured',
        region: getRegionCode(),
        configured: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_S3_BUCKET_NAME),
        documentCount: 0,
      },
    }
    if (health.status === 'ok') {
      health.status = 'degraded'
    }
  }

  return NextResponse.json(health, {
    status: health.status === 'ok' ? 200 : 200,
  })
}
