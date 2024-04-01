export enum TransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense',
}

export interface Transaction {
  id: string
  budgetId: string
  type: TransactionType
  store: string
  amount: number
  date: Date
  category: string
}

export const useTransactionStore = defineStore('transactions', () => {
  const budget = useBudgetStore()
  const { $client } = useNuxtApp()
  const toast = useToast()

  const transactions = ref<Transaction[]>([])

  const isEmpty = computed(() => transactions.value.length === 0)
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
      0
    )
  )
  const hasTransaction = (id: string) =>
    transactions.value.some((transaction) => transaction.id === id)
  const getTransactionById = (id: string) =>
    transactions.value.find((transaction) => transaction.id === id)
  const getTransactionsByType = (type: TransactionType) =>
    transactions.value.filter((transaction) => transaction.type === type)
  const getTransactionsByCategory = (category: string) =>
    transactions.value.filter(
      (transaction) => transaction.category === category
    )
  const getTransactionsByStore = (store: string) =>
    transactions.value.filter((transaction) => transaction.store === store)

  const addTransaction = async (transaction: Transaction) => {
    transactions.value.push(transaction)

    const { type, store, amount, date, category } = transaction
    const index = transactions.value.findIndex((t) => t.id === transaction.id)

    try {
      const result = await $client.transaction.create.mutate({
        budgetId: budget.budget.id,
        type: type === TransactionType.INCOME ? 'INCOME' : 'EXPENSE', // TODO: Fix this
        store,
        amount,
        date,
        category,
      })

      const newTransaction = {
        id: result.id,
        budgetId: result.budgetId,
        type: TransactionType[result.type],
        store: result.store.name,
        amount: result.amount,
        date: new Date(result.date),
        category: result.category.name,
      }

      transactions.value.splice(index, 1, newTransaction)

      return newTransaction
    } catch (error) {
      transactions.value.splice(index, 1)

      toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })

      return null
    }
  }

  const removeTransaction = async (id: string) => {
    const index = transactions.value.findIndex(
      (transaction) => transaction.id === id
    )
    const transaction = transactions.value[index]
    transactions.value.splice(index, 1)

    try {
      await $client.transaction.delete.mutate({ id })
    } catch (error) {
      transactions.value.splice(index, 0, transaction)

      return toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })
    }
  }

  const fetchTransactions = async () => {
    if (transactions.value.length > 0) return

    await budget.fetchBudget()

    try {
      const { data } = await $client.transaction.list.useQuery()

      if (!data?.value) return

      transactions.value = []
      for (const transaction of data.value) {
        transactions.value.push({
          id: transaction.id,
          budgetId: transaction.budgetId,
          type: TransactionType[
            transaction.type as keyof typeof TransactionType
          ],
          store: transaction.store.name,
          amount: transaction.amount,
          date: new Date(transaction.date),
          category: transaction.category.name,
        })
      }
    } catch (error) {
      return toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })
    }
  }

  const editTransaction = async (data: {
    id: string
    amount?: number
    date?: Date
    categoryId?: string
    budgetId?: string
    storeId?: string
  }) => {
    try {
      const newTransaction =
        await $client.transaction.editTransaction.mutate(data)

      return newTransaction
    } catch (error) {
      return toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })
    }
  }

  fetchTransactions()

  return {
    transactions,
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
    removeTransaction,
    fetchTransactions,
    editTransaction,
  }
})
