export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface ApiResponse<T> {
  data: T
}

export interface ApiError {
  error: string
}
