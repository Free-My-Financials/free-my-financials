import { skipHydrate } from 'pinia'

export interface Budget {
  startDate: Date
  amount: number
  endDate: Date
}

export const useBudgetStore = defineStore('budget', () => {
  const { $client } = useNuxtApp()

  const budget = ref<Budget>({
    startDate: new Date(),
    amount: 0,
    endDate: new Date(),
  })

  const amount = computed(() => budget.value.amount)
  const startDate = computed(() => new Date(budget.value.startDate))
  const endDate = computed(() => new Date(budget.value.endDate))

  const hasStarted = computed(
    () => budget.value.startDate.getTime() <= Date.now()
  )
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
    return transactions.transactions.filter((transaction) =>
      transactionIsInBudget(transaction)
    )
  })

  const totalIncome = computed(() =>
    transactions.value
      .filter((transaction) => transaction.type === TransactionType.INCOME)
      .reduce((total, transaction) => total + transaction.amount, 0)
  )
  const totalExpense = computed(() =>
    transactions.value
      .filter((transaction) => transaction.type === TransactionType.EXPENSE)
      .reduce((total, transaction) => total + transaction.amount, 0)
  )
  const totalBalance = computed(() =>
    transactions.value.reduce(
      (total, transaction) =>
        total +
        (transaction.type === TransactionType.INCOME
          ? transaction.amount
          : -transaction.amount),
      budget.value.amount
    )
  )

  const setBudget = (budget: Budget) => {
    setAmount(budget.amount)
    setStartDate(budget.startDate)
    setEndDate(budget.endDate)
  }

  const setStartDate = async (date: Date) => {
    if (budget.value.startDate.getTime() === date.getTime()) return

    const oldDate = budget.value.startDate
    budget.value.startDate = date

    try {
      await $client.budget.update.mutate({
        start: date,
      })
    } catch (error) {
      budget.value.startDate = oldDate
    }
  }

  const setEndDate = async (date: Date) => {
    if (budget.value.endDate.getTime() === date.getTime()) return

    const oldDate = budget.value.endDate
    budget.value.endDate = date

    try {
      await $client.budget.update.mutate({
        end: date,
      })
    } catch (error) {
      budget.value.endDate = oldDate
    }
  }

  const setAmount = async (amount: number) => {
    if (budget.value.amount === amount) return

    const oldAmount = budget.value.amount
    budget.value.amount = amount

    try {
      await $client.budget.update.mutate({
        amount,
      })
    } catch (error) {
      budget.value.amount = oldAmount
    }
  }

  const fetchBudget = async () => {
    try {
      const { data } = await $client.budget.get.useQuery()

      if (!data.value) return new Error('Something went wrong')

      budget.value.amount = data.value.amount
      budget.value.startDate = new Date(data.value.start)
      budget.value.endDate = new Date(data.value.end)
    } catch (error) {
      console.error(error)
    }
  }

  fetchBudget()

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
    transactions,
    totalIncome,
    totalExpense,
    totalBalance,
    setBudget,
    setStartDate,
    setEndDate,
    setAmount,
    fetchBudget,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useBudgetStore, import.meta.hot))
