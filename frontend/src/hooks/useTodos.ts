import { useState, useCallback, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  restoreTodo,
} from '../api/todos'
import type { Todo, ApiResponse } from '@todo/shared'

export function useTodos() {
  const queryClient = useQueryClient()
  const [actionError, setActionError] = useState<string | null>(null)
  const errorTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => clearTimeout(errorTimerRef.current)
  }, [])

  const showError = useCallback((message: string) => {
    clearTimeout(errorTimerRef.current)
    setActionError(message)
    errorTimerRef.current = setTimeout(() => setActionError(null), 5000)
  }, [])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
    select: (response) => response.data,
  })

  const createMutation = useMutation({
    mutationFn: (text: string) => createTodo(text),
    onMutate: async (text) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previous = queryClient.getQueryData<ApiResponse<Todo[]>>(['todos'])
      queryClient.setQueryData<ApiResponse<Todo[]>>(['todos'], (old) => ({
        ...old,
        data: [
          {
            id: crypto.randomUUID(),
            text,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
          },
          ...(old?.data ?? []),
        ],
      }))
      return { previous }
    },
    onError: (_err, _text, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['todos'], context.previous)
      }
      showError('Failed to create task. Please try again.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      updateTodo(id, { completed }),
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previous = queryClient.getQueryData<ApiResponse<Todo[]>>(['todos'])
      queryClient.setQueryData<ApiResponse<Todo[]>>(['todos'], (old) => ({
        ...old,
        data: (old?.data ?? []).map((t) =>
          t.id === id ? { ...t, completed } : t,
        ),
      }))
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['todos'], context.previous)
      }
      showError('Failed to update task. Please try again.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const editMutation = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      updateTodo(id, { text }),
    onMutate: async ({ id, text }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previous = queryClient.getQueryData<ApiResponse<Todo[]>>(['todos'])
      queryClient.setQueryData<ApiResponse<Todo[]>>(['todos'], (old) => ({
        ...old,
        data: (old?.data ?? []).map((t) =>
          t.id === id ? { ...t, text } : t,
        ),
      }))
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['todos'], context.previous)
      }
      showError('Failed to save edit. Please try again.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previous = queryClient.getQueryData<ApiResponse<Todo[]>>(['todos'])
      queryClient.setQueryData<ApiResponse<Todo[]>>(['todos'], (old) => ({
        ...old,
        data: (old?.data ?? []).filter((t) => t.id !== id),
      }))
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['todos'], context.previous)
      }
      showError('Failed to delete task. Please try again.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const restoreMutation = useMutation({
    mutationFn: ({ id }: { id: string; todo: Todo }) => restoreTodo(id),
    onMutate: async ({ todo }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previous = queryClient.getQueryData<ApiResponse<Todo[]>>(['todos'])
      queryClient.setQueryData<ApiResponse<Todo[]>>(['todos'], (old) => {
        const existing = old?.data ?? []
        const insertIdx = existing.findIndex(
          (t) => t.createdAt < todo.createdAt,
        )
        const restored = { ...todo, deletedAt: null }
        const newData =
          insertIdx === -1
            ? [...existing, restored]
            : [
                ...existing.slice(0, insertIdx),
                restored,
                ...existing.slice(insertIdx),
              ]
        return { ...old, data: newData }
      })
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['todos'], context.previous)
      }
      showError('Failed to restore task. Please try again.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return {
    todos: data ?? [],
    isLoading,
    isError,
    refetch,
    actionError,
    clearError: () => setActionError(null),
    createTodo: createMutation.mutate,
    toggleTodo: (id: string, completed: boolean) =>
      toggleMutation.mutate({ id, completed }),
    editTodo: (id: string, text: string) =>
      editMutation.mutate({ id, text }),
    removeTodo: deleteMutation.mutate,
    undoDelete: (id: string, todo: Todo) =>
      restoreMutation.mutate({ id, todo }),
  }
}
