export interface Budget {
  id: string
  name: string
  startDate: Date
  amount: number
  endDate: Date
}

export const useBudgetStore = defineStore('budget', () => {
  const auth = useAuthStore()
  const { $client } = useNuxtApp()
  const toast = useToast()

  const budget = ref<Budget>({
    id: '',
    name: '',
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
        id: budget.value.id,
      })
    } catch (error) {
      budget.value.startDate = oldDate

      toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })
    }
  }

  const setEndDate = async (date: Date) => {
    if (budget.value.endDate.getTime() === date.getTime()) return

    const oldDate = budget.value.endDate
    budget.value.endDate = date

    try {
      await $client.budget.update.mutate({
        end: date,
        id: budget.value.id,
      })
    } catch (error) {
      budget.value.endDate = oldDate

      toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })
    }
  }

  const setAmount = async (amount: number) => {
    if (budget.value.amount === amount) return

    const oldAmount = budget.value.amount
    budget.value.amount = amount

    try {
      await $client.budget.update.mutate({
        amount,
        id: budget.value.id,
      })
    } catch (error) {
      budget.value.amount = oldAmount

      toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })
    }
  }

  const fetchBudget = async () => {
    if (!auth.isLoggedIn) return

    try {
      const { data } = await $client.budget.list.useQuery()

      if (!data.value) return new Error('Something went wrong')
      if (data.value.length === 0) return new Error('Something went wrong')

      budget.value.amount = data.value[0].amount
      budget.value.name = data.value[0].name
      budget.value.id = data.value[0].id
      budget.value.startDate = new Date(data.value[0].start)
      budget.value.endDate = new Date(data.value[0].end)
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })
    }
  }

  fetchBudget()

  return {
    budget,
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
