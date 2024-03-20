import { describe, beforeEach, test, expect } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const defaultBudget = {
  id: 'abc123',
  name: 'Budget',
  amount: 0,
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
}

const newBudget = {
  id: defaultBudget.id,
  name: 'New Budget',
  amount: 1000,
  startDate: new Date('2023-01-01'),
  endDate: new Date('2025-12-31'),
}

describe('Budget Store', () => {
  mockNuxtImport('useTransactionStore', () => {
    return () => {
      return {
        transactions: [
          {
            date: new Date('2024-06-15'),
            type: TransactionType.INCOME,
            amount: 100,
          },
          {
            date: new Date('2024-06-15'),
            type: TransactionType.EXPENSE,
            amount: 50,
          },
          {
            date: new Date('2023-12-31'),
            type: TransactionType.INCOME,
            amount: 100,
          },
          {
            date: new Date('2025-01-01'),
            type: TransactionType.EXPENSE,
            amount: 50,
          },
        ] as Transaction[],
      }
    }
  })

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

    expect(
      budget.transactionIsInBudget({
        budgetId: defaultBudget.id,
        date: new Date('2023-12-31'),
      } as Transaction)
    ).toBe(false)
  })

  test('Transaction after budget is not in budget', async () => {
    const budget = useBudgetStore()

    expect(
      budget.transactionIsInBudget({
        budgetId: defaultBudget.id,
        date: new Date('2025-01-01'),
      } as Transaction)
    ).toBe(false)
  })

  test('Transaction in budget is in budget', async () => {
    const budget = useBudgetStore()

    expect(
      budget.transactionIsInBudget({
        budgetId: defaultBudget.id,
        date: new Date('2024-06-15'),
      } as Transaction)
    ).toBe(true)
  })

  test('Income is zero when transactions are not present', async () => {
    const budget = useBudgetStore()
    expect(budget.totalIncome).toBe(0)
  })

  test('EXPENSE is zero when transactions havent been added to budget', async () => {
    const budget = useBudgetStore()

    expect(budget.totalExpense).toBe(0)
  })

  test('totalBalance amount plus transactions value', async () => {
    const budget = useBudgetStore()
    budget.budget.amount = 100
    expect(budget.totalBalance).toBe(100)
  })

  test('fetchBudget returns undefined when requested id matches currentID', async () => {
    const budget = useBudgetStore()
    budget.budget.id = ''
    expect(await budget.fetchBudget()).toBe(undefined)
  })

  test('startDate returns undefined when requested setting date matches current date', async () => {
    const budget = useBudgetStore()
    budget.budget.startDate = new Date('2023-01-01')
    expect(await budget.setStartDate(new Date('2023-01-01'))).toBe(undefined)
  })

  test('setAmount returns undefined when requested setting amount matches current amount', async () => {
    const budget = useBudgetStore()
    budget.budget.amount = 22
    expect(await budget.setAmount(22)).toBe(undefined)
  })
})
