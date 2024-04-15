import { describe, test, expect } from 'vitest'
import { createContext } from '~/server/trpc/context'

// this is cheeky and bad we will need to talk about it
describe('Context', () => {
  test('createContext is a function', () => {
    expect(createContext).toBeTypeOf('function')
  })
})
