import { Router } from 'express'
import { CreateTodoSchema, UpdateTodoSchema } from '@todo/shared'
import prisma from '../lib/prisma.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.get('/', async (_req, res) => {
  const todos = await prisma.todo.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
  })
  res.json({ data: todos })
})

router.post('/', validate(CreateTodoSchema), async (req, res) => {
  const todo = await prisma.todo.create({
    data: { text: req.body.text },
  })
  res.status(201).json({ data: todo })
})

// Batch delete all todos (development/testing only)
if (process.env.NODE_ENV !== 'production') {
  router.delete('/', async (_req, res) => {
    await prisma.todo.deleteMany()
    res.json({ data: [] })
  })
}

router.delete('/:id', async (req, res) => {
  const todo = await prisma.todo.update({
    where: { id: req.params.id, deletedAt: null },
    data: { deletedAt: new Date() },
  })
  res.json({ data: todo })
})

router.patch('/:id/restore', async (req, res) => {
  const todo = await prisma.todo.update({
    where: { id: req.params.id, deletedAt: { not: null } },
    data: { deletedAt: null },
  })
  res.json({ data: todo })
})

router.patch('/:id', validate(UpdateTodoSchema), async (req, res) => {
  const { text, completed } = req.body
  const todo = await prisma.todo.update({
    where: { id: req.params.id, deletedAt: null },
    data: {
      ...(text !== undefined && { text }),
      ...(completed !== undefined && { completed }),
    },
  })
  res.json({ data: todo })
})

export default router
