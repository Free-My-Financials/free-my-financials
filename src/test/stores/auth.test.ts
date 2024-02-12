import { describe, test, expect } from 'vitest'

const username = 'SAM'

describe('Auth Store', () => {
  test('User isLoggedIn works', async () => {
    const auth = useAuthStore()

    expect(auth.isLoggedIn).toBe(false)

    auth.user = {
      id: '1',
      username,
    }

    expect(auth.isLoggedIn).toBe(true)
  })
})
