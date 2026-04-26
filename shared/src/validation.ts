import { z } from 'zod'

export const CreateTodoSchema = z.object({
  text: z.string().min(1),
})

export const UpdateTodoSchema = z.object({
  text: z.string().min(1).optional(),
  completed: z.boolean().optional(),
}).refine((data) => data.text !== undefined || data.completed !== undefined, {
  message: 'At least one field (text or completed) is required',
})

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>
