import { describe, test, expect } from 'vitest'
import { github } from '~/server/utils/auth'

// this is cheeky and bad we will need to talk about it
describe('Auth', () => {
  test('Auth Github object is an object', () => {
    expect(github).toBeTypeOf('object')
  })
})
