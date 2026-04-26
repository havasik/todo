import { config } from 'dotenv'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

config({ path: path.join(import.meta.dirname, '..', '..', '..', '.env') })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

export default prisma
