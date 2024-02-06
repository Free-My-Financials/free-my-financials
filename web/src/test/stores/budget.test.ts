import { describe, beforeEach, test, expect } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

mockNuxtImport('useTransactionStore', () => {
  return () => {
    return {
      transactions: [
        { date: new Date('2024-06-15'), type: TransactionType.INCOME, amount: 100 },
        { date: new Date('2024-06-15'), type: TransactionType.EXPENSE, amount: 50 },
        { date: new Date('2023-12-31'), type: TransactionType.INCOME, amount: 100 },
        { date: new Date('2025-01-01'), type: TransactionType.EXPENSE, amount: 50 },
      ]
    }
  }
})

const defaultBudget = {
  amount: 0,
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
}

const newBudget = {
  amount: 1000,
  startDate: new Date('2023-01-01'),
  endDate: new Date('2025-12-31'),
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

  test('Set budget updates budget', async () => {
    const budget = useBudgetStore()

    budget.setBudget(newBudget)

    expect(budget.amount).toBe(newBudget.amount)
    expect(budget.startDate).toEqual(newBudget.startDate)
    expect(budget.endDate).toEqual(newBudget.endDate)
  })

  test('Set start date updates budget start date', async () => {
    const budget = useBudgetStore()

    budget.setStartDate(newBudget.startDate)

    expect(budget.startDate).toEqual(newBudget.startDate)
  })

  test('Set end date updates budget end date', async () => {
    const budget = useBudgetStore()

    budget.setEndDate(newBudget.endDate)

    expect(budget.endDate).toEqual(newBudget.endDate)
  })

  test('Set amount updates budget amount', async () => {
    const budget = useBudgetStore()

    budget.setAmount(newBudget.amount)

    expect(budget.amount).toBe(newBudget.amount)
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

  test('Transactions in budget are returned', async () => {
    const budget = useBudgetStore()

    expect(budget.transactions.length).toBe(2)
  })

  test('Total income is calculated correctly', async () => {
    const budget = useBudgetStore()

    expect(budget.totalIncome).toBe(100)
  })

  test('Total expense is calculated correctly', async () => {
    const budget = useBudgetStore()

    expect(budget.totalExpense).toBe(50)
  })

  test('Total balance is calculated correctly', async () => {
    const budget = useBudgetStore()

    expect(budget.totalBalance).toBe(50)
  })

  test('Transactions in budget update when budget is updated', async () => {
    const budget = useBudgetStore()

    expect(budget.transactions.length).toBe(2)

    budget.setStartDate(new Date('2023-01-01'))

    expect(budget.transactions.length).toBe(3)

    budget.setEndDate(new Date('2025-12-31'))

    expect(budget.transactions.length).toBe(4)
  })
})
