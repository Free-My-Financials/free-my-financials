export const useCategoryStore = defineStore('categories', () => {
  const budget = useBudgetStore()
  const { $client } = useNuxtApp()
  const toast = useToast()

  const categories = ref<string[]>([])

  const isEmpty = computed(() => categories.value.length === 0)
  const hasCategory = (name: string) => categories.value.includes(name)

  const addCategory = async (name: string) => {
    if (hasCategory(name)) return

    categories.value.push(name)

    try {
      await $client.category.create.mutate({
        budgetId: budget.budget.id,
        name,
      })
    } catch (error) {
      categories.value = categories.value.filter(
        (category) => category !== name
      )

      toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })
    }
  }

  const fetchCategories = async () => {
    if (!isEmpty.value) return

    await budget.fetchBudget()

    try {
      const { data } = await $client.category.list.useQuery({
        budgetId: budget.budget.id,
      })

      if (!data?.value) {
        return new Error('Something went wrong')
      }

      categories.value = data.value.map((category) => category.name)
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })
      return new Error('Something went wrong')
    }
  }

  fetchCategories()

  return {
    categories,
    isEmpty,
    hasCategory,
    addCategory,
    fetchCategories,
  }
})
