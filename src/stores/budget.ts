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

  const currentID = useCookie('currentBudgetID')

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
    return (
      transaction.budgetId == budget.value.id &&
      dateIsInBudget(transaction.date)
    )
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

  const setBudget = (data: Budget) => {
    budget.value.id = data.id
    setAmount(data.amount)
    setStartDate(data.startDate)
    setEndDate(data.endDate)
    setName(data.name)
  }

  const setName = async (Name: string) => {
    if (budget.value.name === Name) return

    const oldName = budget.value.name
    budget.value.name = Name

    try {
      await $client.budget.update.mutate({
        name: Name,
        id: budget.value.id,
      })
    } catch (error) {
      budget.value.name = oldName

      toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })
    }
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

  const createNewBudget = async (data: {
    name: string
    amount: number
    start: Date
    end: Date
  }) => {
    await auth.fetchUser()

    try {
      const info = $client.budget.create.query(data)
      return info
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })
    }
  }

  const createBudgetSelection = async () => {
    await auth.fetchUser()
    try {
      const { data } = await $client.budget.list.useQuery()
      if (!data.value) return new Error('Something went wrong')
      if (data.value.length === 0) return new Error('Something went wrong')
      console.log(data)
      const numberOfBudgets = data.value.length
      const budgetOptions: {
        label: string
        value: string
        click: () => void
      }[][] = new Array(numberOfBudgets)

      for (let num = 0; num <= numberOfBudgets - 1; num++) {
        const name = data.value[num].name.toString()
        const id = data.value[num].id.toString()
        budgetOptions.push([
          {
            label: name,
            value: id,
            click: () => {
              currentID.value = id
              window.location.reload()
            },
          },
        ])
      }

      return budgetOptions
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })
    }
  }

  const fetchBudget = async () => {
    if (currentID.value) {
      fetchBudgetByID(currentID.value)
      return
    }

    await auth.fetchUser()

    try {
      const { data } = await $client.budget.list.useQuery()

      if (!data.value) return new Error('Something went wrong')
      if (data.value.length === 0) return new Error('Something went wrong')

      currentID.value = data.value[0].id
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

  const fetchBudgetByID = async (id: string) => {
    if (budget.value.id === id) return

    await auth.fetchUser()

    try {
      const { data } = await $client.budget.get.useQuery({
        id: id,
      })
      if (!data.value) return new Error('Something went wrong')

      budget.value.amount = data.value.amount
      budget.value.name = data.value.name
      budget.value.id = data.value.id
      budget.value.startDate = new Date(data.value.start)
      budget.value.endDate = new Date(data.value.end)
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
    createNewBudget,
    createBudgetSelection,
    setBudget,
    setStartDate,
    setEndDate,
    setAmount,
    fetchBudget,
  }
})
