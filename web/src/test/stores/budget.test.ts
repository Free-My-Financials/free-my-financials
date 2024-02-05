import { describe, test, expect } from 'vitest'

describe('Budget Store', () => {
  test('setBudget works', async () => {
    const budget = useBudgetStore()

    const newBudget = {
      amount: 1000,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
    }

    budget.setBudget(newBudget)

    expect(budget.amount).toBe(newBudget.amount)
    expect(budget.startDate).toEqual(newBudget.startDate)
    expect(budget.endDate).toEqual(newBudget.endDate)
  })

  test('setStartDate works', async () => {
    const budget = useBudgetStore()

    const newDate = new Date('2024-01-01')

    budget.setStartDate(newDate)

    expect(budget.startDate).toEqual(newDate)
  })

  test('setEndDate works', async () => {
    const budget = useBudgetStore()

    const newDate = new Date('2024-12-31')

    budget.setEndDate(newDate)

    expect(budget.endDate).toEqual(newDate)
  })

  test('setAmount works', async () => {
    const budget = useBudgetStore()

    const newAmount = 1000

    budget.setAmount(newAmount)

    expect(budget.amount).toBe(newAmount)
  })

  test('dateIsInBudget works', async () => {
    const budget = useBudgetStore()

    budget.setBudget({
      amount: 1000,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
    })

    expect(budget.dateIsInBudget(new Date('2024-01-01'))).toBe(true)
    expect(budget.dateIsInBudget(new Date('2024-12-31'))).toBe(true)
    expect(budget.dateIsInBudget(new Date('2024-01-02'))).toBe(true)
    expect(budget.dateIsInBudget(new Date('2024-12-30'))).toBe(true)
    expect(budget.dateIsInBudget(new Date('2023-12-31'))).toBe(false)
    expect(budget.dateIsInBudget(new Date('2025-01-01'))).toBe(false)
  })
})
