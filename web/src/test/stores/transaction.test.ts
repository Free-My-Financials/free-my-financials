import { describe, test, expect } from 'vitest'

describe('Transactions Store', () => {
  enum TransactionType {
    INCOME = "Income",
    EXPENSE = "Expense",
  }

  const sampleTransaction = {
    id: "Hi",
    type: TransactionType.EXPENSE,
    store: "Fortnite",
    amount: 99,
    date: new Date("2023-01-01"),
    category: "Food",
  }
  const sampleIncome = {
    id: "SuperHi",
    type: TransactionType.INCOME,
    store: "Bounty Hunting",
    amount: 199,
    date: new Date("2023-01-12"),
    category: "Income",
  }
  const sampleSecondaryTransaction = {
    id: "LowHi",
    type: TransactionType.EXPENSE,
    store: "Fortnite",
    amount: 25,
    date: new Date("2023-03-01"),
    category: "Food",
  }


  test('Transaction can be added', async () => {
    const transactions = useTransactionStore()

    transactions.addTransaction(sampleTransaction)

    expect(transactions.transactions.length).toBeGreaterThan(0);
  })

  test('Total Balance ', async () => {
    const transactions = useTransactionStore()


    expect(transactions.totalBalance).toBe(-99);
  })

  test('Add Income ', async () => {
    const transactions = useTransactionStore()
    transactions.addTransaction(sampleIncome)


    expect(transactions.totalBalance).toBe(100);
  })
  test('Get Transactions by Store ', async () => {
    const transactions = useTransactionStore()
    transactions.addTransaction(sampleSecondaryTransaction)


    expect(transactions.getTransactionsByStore("Fortnite")).toEqual([sampleTransaction, sampleSecondaryTransaction]);
  })


})
