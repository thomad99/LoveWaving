import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

  return NextResponse.json(health, {
    status: health.status === 'ok' ? 200 : 200,
  })
}
