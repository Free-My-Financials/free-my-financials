import { describe, test, expect } from 'vitest'
import { isAuthed } from '~/server/trpc/middleware/isAuthed'

// this is cheeky and bad we will need to talk about it
describe('isAuthed', () => {
  test('isAuthed is an object', () => {
    expect(isAuthed).toBeTypeOf('object')
  })
})
