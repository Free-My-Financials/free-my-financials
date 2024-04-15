import { describe, test, expect } from 'vitest'
import { google } from '~/server/utils/auth'

// this is cheeky and bad we will need to talk about it
describe('Auth', () => {
  test('Auth Google object is an object', () => {
    expect(google).toBeTypeOf('object')
  })
})
