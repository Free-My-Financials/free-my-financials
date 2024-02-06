import { describe, beforeEach, test, expect } from 'vitest'

const defaultBudget = {
  amount: 0,
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
}

describe('Budget Store', () => {
  beforeEach(async () => {
    const budget = useBudgetStore()

    budget.setBudget(defaultBudget)
  })

  test('Budget is set correctly', async () => {
    const budget = useBudgetStore()

    expect(budget.amount).toBe(defaultBudget.amount)
    expect(budget.startDate).toEqual(defaultBudget.startDate)
    expect(budget.endDate).toEqual(defaultBudget.endDate)
  })

  test('setStartDate works', async () => {
    const budget = useBudgetStore()

    const newDate = new Date('2023-01-01')

    budget.setStartDate(newDate)

    expect(budget.startDate).toEqual(newDate)
  })

  test('setEndDate works', async () => {
    const budget = useBudgetStore()

    const newDate = new Date('2025-12-31')

    budget.setEndDate(newDate)

    expect(budget.endDate).toEqual(newDate)
  })

  test('setAmount works', async () => {
    const budget = useBudgetStore()

    const newAmount = 1000

    budget.setAmount(newAmount)

    expect(budget.amount).toBe(newAmount)
  })

  test('Date before budget is not in budget', async () => {
    const budget = useBudgetStore()

    expect(budget.dateIsInBudget(new Date('2023-12-31'))).toBe(false)
  })

  test('Date after budget is not in budget', async () => {
    const budget = useBudgetStore()

    expect(budget.dateIsInBudget(new Date('2025-01-01'))).toBe(false)
  })

  test('Date in budget is in budget', async () => {
    const budget = useBudgetStore()

    expect(budget.dateIsInBudget(new Date('2024-06-15'))).toBe(true)
  })

  test('Transaction before budget is not in budget', async () => {
    const budget = useBudgetStore()

    expect(budget.transactionIsInBudget({ date: new Date('2023-12-31') })).toBe(false)
  })

  test('Transaction after budget is not in budget', async () => {
    const budget = useBudgetStore()

    expect(budget.transactionIsInBudget({ date: new Date('2025-01-01') })).toBe(false)
  })

  test('Transaction in budget is in budget', async () => {
    const budget = useBudgetStore()

    expect(budget.transactionIsInBudget({ date: new Date('2024-06-15') })).toBe(true)
  })
})
