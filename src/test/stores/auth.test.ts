import { describe, test, expect, beforeEach } from 'vitest'

const username = 'SAM'

describe('Auth Store', () => {
  beforeEach(async () => {
    const auth = useAuthStore()

    auth.user = null
  })
  test('User isLoggedIn works', async () => {
    const auth = useAuthStore()

    expect(auth.isLoggedIn).toBe(false)

    auth.user = {
      id: '1',
      username,
    }

    expect(auth.isLoggedIn).toBe(true)
  })

  test('Fetching the user without mocking calls returns undefined', async () => {
    const auth = useAuthStore()

    expect(await auth.fetchUser()).toBe(undefined)
  })

  test('Fetching the user when logged in returns undefined', async () => {
    const auth = useAuthStore()

    auth.user = {
      id: '1',
      username,
    }

    expect(await auth.fetchUser()).toBe(undefined)
  })

  test('Register has no return', async () => {
    const auth = useAuthStore()

    expect(await auth.register()).toBe(undefined)
  })

  test('Login has no return', async () => {
    const auth = useAuthStore()

    expect(await auth.login()).toBe(undefined)
  })
})
