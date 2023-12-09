import { skipHydrate } from 'pinia'

export interface Budget {
  startDate: Date
  amount: number
  endDate: Date
}

export const useBudgetStore = defineStore('budget', () => {
  const budget =  useCookie("budget", {
    default: (): Budget => ({
      amount: 1,
      startDate: new Date(2023, 0, 1),
      endDate: new Date(2023, 0, 30),
    }),
    sameSite: "lax",
  })

  const amount = computed(() => budget.value.amount)
  const startDate = computed(() => new Date(budget.value.startDate))
  const endDate = computed(() => new Date(budget.value.endDate))

  const hasStarted = computed(() => budget.value.startDate.getTime() <= Date.now())
  const hasEnded = computed(() => budget.value.endDate.getTime() <= Date.now())
  const isRunning = computed(() => hasStarted.value && !hasEnded.value)

  const dateIsInBudget = (date: Date) => {
    return date >= budget.value.startDate && date <= budget.value.endDate
  }

  const transactionIsInBudget = (transaction: Transaction) => {
    return dateIsInBudget(transaction.date)
  }

  const transactions = computed(() => {
    const transactions = useTransactionStore()
    return transactions.transactions.filter((transaction) => transactionIsInBudget(transaction))
  })

  const totalIncome = computed(() => transactions.value.filter((transaction) => transaction.type === TransactionType.INCOME).reduce((total, transaction) => total + transaction.amount, 0))
  const totalExpense = computed(() => transactions.value.filter((transaction) => transaction.type === TransactionType.EXPENSE).reduce((total, transaction) => total + transaction.amount, 0))
  const totalBalance = computed(() => transactions.value.reduce((total, transaction) => total + (transaction.type === TransactionType.INCOME ? transaction.amount : -transaction.amount), budget.value.amount))

  const setBudget = (budget: Budget) => {
    setAmount(budget.amount)
    setStartDate(budget.startDate)
    setEndDate(budget.endDate)
  }

  const setStartDate = (date: Date) => {
    budget.value.startDate = date
  }

  const setEndDate = (date: Date) => {
    budget.value.endDate = date
  }

  const setAmount = (amount: number) => {
    budget.value.amount = amount
  }

  return {
    budget: skipHydrate(budget),
    amount,
    startDate,
    endDate,
    hasStarted,
    hasEnded,
    isRunning,
    dateIsInBudget,
    transactionIsInBudget,
    transactions: skipHydrate(transactions),
    totalIncome,
    totalExpense,
    totalBalance,
    setBudget,
    setStartDate,
    setEndDate,
    setAmount,
  }
})
