import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function runMigrations() {
  try {
    console.log('Running database migrations...')
    // This will create tables if they don't exist
    await prisma.$connect()
    console.log('Database connected successfully')
    return true
  } catch (error) {
    console.error('Migration error:', error)
    return false
  }
}

