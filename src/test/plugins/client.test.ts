import { describe, test, expect } from 'vitest'
import client from '~/plugins/client'

describe('Client Plug in', () => {
  test('Client plugin is a function', () => {
    expect(client).toBeTypeOf('function')
  })
})
