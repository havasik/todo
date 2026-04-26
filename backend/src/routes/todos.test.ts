import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../index.js'
import prisma from '../lib/prisma.js'

beforeEach(async () => {
  await prisma.todo.deleteMany()
})

describe('POST /api/todos', () => {
  it('creates a todo and returns 201', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ text: 'Buy groceries' })

    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({
      text: 'Buy groceries',
      completed: false,
    })
    expect(res.body.data.id).toBeDefined()
    expect(res.body.data.createdAt).toBeDefined()
    expect(res.body.data.deletedAt).toBeNull()
  })

  it('rejects empty text with 400', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ text: '' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
    expect(res.body.error).toBeTypeOf('string')
  })

  it('rejects missing text with 400', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({})

    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })
})

describe('GET /api/todos', () => {
  it('returns empty array when no todos exist', async () => {
    const res = await request(app).get('/api/todos')

    expect(res.status).toBe(200)
    expect(res.body.data).toEqual([])
  })

  it('returns todos ordered by createdAt descending', async () => {
    await prisma.todo.create({ data: { text: 'First' } })
    // Small delay to ensure different timestamps
    await new Promise((r) => setTimeout(r, 10))
    await prisma.todo.create({ data: { text: 'Second' } })

    const res = await request(app).get('/api/todos')

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(2)
    expect(res.body.data[0].text).toBe('Second')
    expect(res.body.data[1].text).toBe('First')
  })

  it('excludes soft-deleted todos', async () => {
    await prisma.todo.create({ data: { text: 'Active' } })
    await prisma.todo.create({
      data: { text: 'Deleted', deletedAt: new Date() },
    })

    const res = await request(app).get('/api/todos')

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].text).toBe('Active')
  })
})

describe('PATCH /api/todos/:id', () => {
  it('updates completed to true and returns 200', async () => {
    const created = await prisma.todo.create({ data: { text: 'Test task' } })

    const res = await request(app)
      .patch(`/api/todos/${created.id}`)
      .send({ completed: true })

    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({
      id: created.id,
      text: 'Test task',
      completed: true,
    })
  })

  it('updates completed to false and returns 200', async () => {
    const created = await prisma.todo.create({
      data: { text: 'Done task', completed: true },
    })

    const res = await request(app)
      .patch(`/api/todos/${created.id}`)
      .send({ completed: false })

    expect(res.status).toBe(200)
    expect(res.body.data.completed).toBe(false)
  })

  it('returns 404 for non-existent todo', async () => {
    const res = await request(app)
      .patch('/api/todos/00000000-0000-0000-0000-000000000000')
      .send({ completed: true })

    expect(res.status).toBe(404)
    expect(res.body.error).toBeDefined()
  })

  it('updates text and returns 200', async () => {
    const created = await prisma.todo.create({ data: { text: 'Original' } })

    const res = await request(app)
      .patch(`/api/todos/${created.id}`)
      .send({ text: 'Updated' })

    expect(res.status).toBe(200)
    expect(res.body.data.text).toBe('Updated')
  })

  it('rejects empty text with 400', async () => {
    const created = await prisma.todo.create({ data: { text: 'Test' } })

    const res = await request(app)
      .patch(`/api/todos/${created.id}`)
      .send({ text: '' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })

  it('returns 400 for invalid body', async () => {
    const created = await prisma.todo.create({ data: { text: 'Test' } })

    const res = await request(app)
      .patch(`/api/todos/${created.id}`)
      .send({ completed: 'not-a-boolean' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })
})

describe('DELETE /api/todos/:id', () => {
  it('soft-deletes todo and returns it with deletedAt set', async () => {
    const created = await prisma.todo.create({ data: { text: 'To delete' } })

    const res = await request(app).delete(`/api/todos/${created.id}`)

    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe(created.id)
    expect(res.body.data.deletedAt).not.toBeNull()
  })

  it('returns 404 for non-existent todo', async () => {
    const res = await request(app).delete(
      '/api/todos/00000000-0000-0000-0000-000000000000',
    )

    expect(res.status).toBe(404)
    expect(res.body.error).toBeDefined()
  })

  it('returns 404 for already-deleted todo', async () => {
    const created = await prisma.todo.create({
      data: { text: 'Already deleted', deletedAt: new Date() },
    })

    const res = await request(app).delete(`/api/todos/${created.id}`)

    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/todos/:id/restore', () => {
  it('restores a soft-deleted todo', async () => {
    const created = await prisma.todo.create({
      data: { text: 'Deleted task', deletedAt: new Date() },
    })

    const res = await request(app).patch(`/api/todos/${created.id}/restore`)

    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe(created.id)
    expect(res.body.data.deletedAt).toBeNull()
  })

  it('returns 404 for non-existent todo', async () => {
    const res = await request(app).patch(
      '/api/todos/00000000-0000-0000-0000-000000000000/restore',
    )

    expect(res.status).toBe(404)
    expect(res.body.error).toBeDefined()
  })
})

describe('error handling', () => {
  it('returns 400 for malformed JSON body', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Content-Type', 'application/json')
      .send('{bad json')

    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })
})

describe('404 handling', () => {
  it('returns 404 JSON for non-existent endpoints', async () => {
    const res = await request(app).get('/api/nonexistent')

    expect(res.status).toBe(404)
    expect(res.body.error).toBeDefined()
    expect(res.body).not.toHaveProperty('stack')
  })
})

describe('GET /api/health', () => {
  it('returns ok status', async () => {
    const res = await request(app).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})
