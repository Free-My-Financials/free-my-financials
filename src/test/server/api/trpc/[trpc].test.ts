import { describe, test, expect } from 'vitest'
import Trpc from '~/server/api/trpc/[trpc]'

// this is cheeky and bad we will need to talk about it
describe('Trpc', () => {
  test('Trpc is a function', () => {
    expect(Trpc).toBeTypeOf('function')
  })
})
