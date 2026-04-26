import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const API = 'http://localhost:5173/api/todos'

test.beforeEach(async ({ request }) => {
  await request.delete(API)
})

test('empty state has no critical WCAG violations', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible()

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.filter((v) => v.impact === 'critical')).toHaveLength(0)
})

test('task list state has no critical WCAG violations', async ({ page }) => {
  await page.goto('/')
  const input = page.getByPlaceholder('What needs to be done?')
  await input.fill('Test task')
  await input.press('Enter')
  await expect(page.getByRole('listitem').first()).toBeVisible()

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.filter((v) => v.impact === 'critical')).toHaveLength(0)
})

test('completed task state has no critical WCAG violations', async ({ page }) => {
  await page.goto('/')
  const input = page.getByPlaceholder('What needs to be done?')
  await input.fill('Completed task')
  await input.press('Enter')
  await expect(page.getByRole('listitem').first()).toBeVisible()
  await page.getByRole('checkbox').first().click()

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.filter((v) => v.impact === 'critical')).toHaveLength(0)
})

test('error state has no critical WCAG violations', async ({ page }) => {
  await page.route('**/api/todos', (route) => route.abort())
  await page.goto('/')
  await expect(page.getByText('Unable to load tasks')).toBeVisible({ timeout: 10000 })

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.filter((v) => v.impact === 'critical')).toHaveLength(0)
})
