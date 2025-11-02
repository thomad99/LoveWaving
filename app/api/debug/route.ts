import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) || 'Not set',
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
    },
  }

  if (action === 'test-db') {
    try {
      // Test 1: Connection
      await prisma.$connect()
      debugInfo.databaseTest = {
        connection: 'OK',
        error: null,
      }

      // Test 2: Raw query to check if tables exist
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `
      debugInfo.databaseTest.tables = tables

      // Test 3: Try to count users
      try {
        const userCount = await prisma.user.count()
        debugInfo.databaseTest.userTableAccess = 'OK'
        debugInfo.databaseTest.userCount = userCount
      } catch (userError: any) {
        debugInfo.databaseTest.userTableAccess = 'FAILED'
        debugInfo.databaseTest.userTableError = userError.message
      }

      // Test 4: Try to count events
      try {
        const eventCount = await prisma.event.count()
        debugInfo.databaseTest.eventTableAccess = 'OK'
        debugInfo.databaseTest.eventCount = eventCount
      } catch (eventError: any) {
        debugInfo.databaseTest.eventTableAccess = 'FAILED'
        debugInfo.databaseTest.eventTableError = eventError.message
      }
    } catch (error: any) {
      debugInfo.databaseTest = {
        connection: 'FAILED',
        error: error.message,
      }
    }
  } else {
    // Just return environment info
    debugInfo.info = 'Use ?action=test-db to run database tests'
  }

  return NextResponse.json(debugInfo)
}

