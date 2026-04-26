import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/index.js'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(`[${new Date().toISOString()}] Error:`, err)

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Invalid JSON' })
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message })
    return
  }

  // Prisma P2025: record not found
  if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === 'P2025'
  ) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  res.status(500).json({ error: 'Internal server error' })
}
