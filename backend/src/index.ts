import { config } from 'dotenv'
import path from 'node:path'

config({ path: path.join(import.meta.dirname, '..', '..', '.env') })
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import todosRouter from './routes/todos.js'
import { NotFoundError } from './errors/index.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/todos', todosRouter)

app.use((_req, _res, next) => {
  next(new NotFoundError())
})

app.use(errorHandler)

export default app
