import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import { describe, test, expect, beforeEach, vi } from 'vitest'

const username = 'SAM'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('user with login can login', async () => {
    const auth = useAuthStore()

    auth.fetchLogin = vi.fn().mockImplementation(async (name: string) => {
      return {
        value: {
          token: 'Hmm?',
          username: name,
        }
      }
    })

    await auth.login(username)

    expect(auth.user).toBe(username)
    // expect(auth.fetchLogin.mock.calls).toBe([])
  })
})
