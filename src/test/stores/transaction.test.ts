import { describe, test, expect, beforeEach } from 'vitest'

describe('Transactions Store', () => {
  enum TransactionType {
    INCOME = 'Income',
    EXPENSE = 'Expense',
  }
  beforeEach(async () => {
    const transaction = useTransactionStore()

    transaction.$reset
  })

  const sampleTransaction = {
    budgetId: 'Money',
    id: 'Hi',
    type: TransactionType.EXPENSE,
    store: 'Fortnite',
    amount: 99,
    date: new Date('2023-01-01'),
    category: 'Food',
  }
  const sampleTransaction2 = {
    budgetId: 'Money',
    id: 'ei',
    type: TransactionType.EXPENSE,
    store: 'Soup',
    amount: 99,
    date: new Date('2023-03-01'),
    category: 'Clothing',
  }
  const sampleIncome = {
    budgetId: 'Money',
    id: 'SuperHi',
    type: TransactionType.INCOME,
    store: 'Bounty Hunting',
    amount: 199,
    date: new Date('2023-01-12'),
    category: 'Income',
  }
  const sampleSecondaryTransaction = {
    budgetId: 'Money',
    id: 'LowHi',
    type: TransactionType.EXPENSE,
    store: 'Fortnite',
    amount: 25,
    date: new Date('2023-03-01'),
    category: 'Food',
  }
  test('Test is isEmpty', async () => {
    const transactions = useTransactionStore()

    expect(transactions.isEmpty).toBe(true)
  })

  test('Transaction can be added', async () => {
    const transactions = useTransactionStore()

    transactions.addTransaction(sampleTransaction)

    expect(transactions.transactions.length).toBeGreaterThan(0)
  })

  test('Transaction being added returns the same transaction', async () => {
    const transactions = useTransactionStore()

    expect(transactions.getTransactionById('Hi')).toEqual(sampleTransaction)
  })

  test('Transactions have a Total Balance ', async () => {
    const transactions = useTransactionStore()

    expect(transactions.totalBalance).toBe(-99)
  })

  test('Transactions can add Income ', async () => {
    const transactions = useTransactionStore()
    transactions.addTransaction(sampleIncome)

    expect(transactions.totalBalance).toBe(100)
  })
  test('Transactions can be got by Store ', async () => {
    const transactions = useTransactionStore()
    transactions.addTransaction(sampleSecondaryTransaction)

    expect(transactions.getTransactionsByStore('Fortnite')).toEqual([
      sampleTransaction,
      sampleSecondaryTransaction,
    ])
  })
  test('Transactions can be got by type ', async () => {
    const transactions = useTransactionStore()

    expect(transactions.getTransactionsByType(TransactionType.INCOME)).toEqual([
      sampleIncome,
    ])
  })
  test('Transactions can be got by category ', async () => {
    const transactions = useTransactionStore()

    expect(transactions.getTransactionsByCategory('Food')).toEqual([
      sampleTransaction,
      sampleSecondaryTransaction,
    ])
  })
  test('Total Expense should be added', async () => {
    const transactions = useTransactionStore()

    expect(transactions.totalExpense).toBe(124)
  })
  test('Total Income should be added', async () => {
    const transactions = useTransactionStore()

    expect(transactions.totalIncome).toBe(199)
  })
  test('Transactions can not get a non existant transaction', async () => {
    const transactions = useTransactionStore()

    expect(transactions.hasTransaction('HELLO CODE READER')).toBe(false)
  })
  test('Transactions should be removed', async () => {
    const transactions = useTransactionStore()
    transactions.removeTransaction(sampleSecondaryTransaction.id)

    expect(transactions.hasTransaction(sampleSecondaryTransaction.id)).toBe(
      false
    )
  })
  test('Transactions should be have transaction added', async () => {
    const transactions = useTransactionStore()

    expect(transactions.hasTransaction(sampleIncome.id)).toBe(true)
  })
  test('Transaction should be able to be got by id', async () => {
    const transactions = useTransactionStore()

    expect(transactions.getTransactionById(sampleTransaction.id)).toEqual(
      sampleTransaction
    )
  })

  test('Transaction adding returns null when it cannot reach the server', async () => {
    const transactions = useTransactionStore()

    expect(await transactions.addTransaction(sampleTransaction2)).toEqual(null)
  })
})
