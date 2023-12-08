import { skipHydrate } from "pinia"

export enum TransactionType {
  INCOME = "Income",
  EXPENSE = "Expense",
}

export interface Transaction {
  id: number
  type: TransactionType
  store: string
  amount: number
  date: Date
  category: string
}

export const useTransactionStore = defineStore('transactions', () => {
  const transactions =  useCookie("transactions", {
    default: (): Transaction[] => [],
    sameSite: "lax",
  })

  const isEmpty = computed(() => transactions.value.length === 0)
  const totalIncome = computed(() => transactions.value.filter((transaction) => transaction.type === TransactionType.INCOME).reduce((total, transaction) => total + transaction.amount, 0))
  const totalExpense = computed(() => transactions.value.filter((transaction) => transaction.type === TransactionType.EXPENSE).reduce((total, transaction) => total + transaction.amount, 0))
  const totalBalance = computed(() => transactions.value.reduce((total, transaction) => total + (transaction.type === TransactionType.INCOME ? transaction.amount : -transaction.amount), 0))
  const hasTransaction = (id: number) => transactions.value.some((transaction) => transaction.id === id)
  const getTransactionById = (id: number) => transactions.value.find((transaction) => transaction.id === id)
  const getTransactionsByType = (type: TransactionType) => transactions.value.filter((transaction) => transaction.type === type)
  const getTransactionsByCategory = (category: string) => transactions.value.filter((transaction) => transaction.category === category)
  const getTransactionsByStore = (store: string) => transactions.value.filter((transaction) => transaction.store === store)

  const addTransaction = (transaction: Transaction) => {
    transactions.value.push(transaction)
  }

  const removeTransaction = (id: number) => {
    const index = transactions.value.findIndex((transaction) => transaction.id === id)
    transactions.value.splice(index, 1)
  }

  const updateTransaction = (transaction: Transaction) => {
    const index = transactions.value.findIndex((t) => t.id === transaction.id)
    transactions.value.splice(index, 1, transaction)
  }

  return {
    transactions: skipHydrate(transactions),
    isEmpty,
    totalIncome,
    totalExpense,
    totalBalance,
    hasTransaction,
    getTransactionById,
    getTransactionsByType,
    getTransactionsByCategory,
    getTransactionsByStore,
    addTransaction,
  }
})
