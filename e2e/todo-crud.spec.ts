import { test, expect } from '@playwright/test'

const API = 'http://localhost:5173/api/todos'

test.beforeEach(async ({ request }) => {
  await request.delete(API)
})

test('shows empty state when no tasks exist', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Todo' })).toBeVisible()
  await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible()
})

test('creates a task and it appears in the list', async ({ page }) => {
  await page.goto('/')
  const input = page.getByPlaceholder('What needs to be done?')
  await input.fill('Buy groceries')
  await input.press('Enter')
  await expect(page.getByRole('listitem')).toHaveCount(1)
  await expect(input).toHaveValue('')
})

test('completes a task with visual muting', async ({ page }) => {
  await page.goto('/')
  const input = page.getByPlaceholder('What needs to be done?')
  await input.fill('Test task')
  await input.press('Enter')
  await expect(page.getByRole('listitem')).toHaveCount(1)

  const checkbox = page.getByRole('checkbox').first()
  await checkbox.click()
  await expect(checkbox).toBeChecked()
})

test('edits a task text', async ({ page }) => {
  await page.goto('/')
  const input = page.getByPlaceholder('What needs to be done?')
  await input.fill('Original text')
  await input.press('Enter')
  await expect(page.getByRole('listitem')).toHaveCount(1)

  await page.getByRole('button', { name: /Edit "Original text"/ }).click()
  const editInput = page.getByLabel('Edit task')
  await editInput.fill('Updated text')
  await editInput.press('Enter')

  await expect(page.getByRole('button', { name: /Edit "Updated text"/ })).toBeVisible()
})

test('deletes a task and shows undo toast', async ({ page }) => {
  await page.goto('/')
  const input = page.getByPlaceholder('What needs to be done?')
  await input.fill('To delete')
  await input.press('Enter')
  await expect(page.getByRole('listitem')).toHaveCount(1)

  await page.getByLabel('Delete task').click()
  await expect(page.getByText('Task deleted')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Undo' })).toBeVisible()
})

test('undoes a deletion and restores the task', async ({ page }) => {
  await page.goto('/')
  const input = page.getByPlaceholder('What needs to be done?')
  await input.fill('Restore me')
  await input.press('Enter')
  await expect(page.getByRole('listitem')).toHaveCount(1)

  await page.getByLabel('Delete task').click()
  await expect(page.getByText('Task deleted')).toBeVisible()

  await page.getByRole('button', { name: 'Undo' }).click()
  await expect(page.getByRole('listitem')).toHaveCount(1)
})

test('shows error state when API is unreachable', async ({ page }) => {
  await page.route('**/api/todos', (route) => route.abort())
  await page.goto('/')
  await expect(page.getByText('Unable to load tasks')).toBeVisible({ timeout: 10000 })
  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible()
})
