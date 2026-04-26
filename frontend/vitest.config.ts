import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/components/**'],
      thresholds: { statements: 70, branches: 70, functions: 70, lines: 70 },
    },
  },
})
