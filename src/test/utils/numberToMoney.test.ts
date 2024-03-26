import { describe, test, expect } from 'vitest'

describe('Number to money', () => {
  test('Amount is converted to money', () => {
    expect(numberToMoney(100)).toBe('$1.00')
  })
})
