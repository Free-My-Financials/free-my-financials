import { describe, test, expect } from 'vitest'

describe('Print Div', () => {
  test('If div doesnt exist, return the cant print string', () => {
    expect(printDiv('FAKEANDNOTREAL')).toBe('Cannot print')
  })
})
