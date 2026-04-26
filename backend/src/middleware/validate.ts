import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'
import { ZodError } from 'zod'
import { ValidationError } from '../errors/index.js'

export function validate(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        next(new ValidationError(err.errors.map((e) => e.message).join(', ')))
      } else {
        next(err)
      }
    }
  }
}
