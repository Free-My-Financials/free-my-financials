import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/components/ui/**'],
    },
    exclude: ['.direnv/**', 'node_modules/**'],
  },
})
