import type { Todo, ApiResponse } from '@todo/shared'

const API_BASE = '/api/todos'

export async function getTodos(): Promise<ApiResponse<Todo[]>> {
  const res = await fetch(API_BASE)
  if (!res.ok) throw new Error('Failed to fetch todos')
  return res.json()
}

export async function createTodo(text: string): Promise<ApiResponse<Todo>> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error('Failed to create todo')
  return res.json()
}

export async function updateTodo(
  id: string,
  data: { completed?: boolean; text?: string },
): Promise<ApiResponse<Todo>> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update todo')
  return res.json()
}

export async function deleteTodo(id: string): Promise<ApiResponse<Todo>> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete todo')
  return res.json()
}

export async function restoreTodo(id: string): Promise<ApiResponse<Todo>> {
  const res = await fetch(`${API_BASE}/${id}/restore`, { method: 'PATCH' })
  if (!res.ok) throw new Error('Failed to restore todo')
  return res.json()
}
