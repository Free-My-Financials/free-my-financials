import { skipHydrate } from 'pinia'

export const useCategoryStore = defineStore('categories', () => {
  const auth = useAuthStore()
  const { $client } = useNuxtApp()

  const categories = ref<string[]>([])

  const isEmpty = computed(() => categories.value.length === 0)
  const hasCategory = (name: string) => categories.value.includes(name)

  const addCategory = async (name: string) => {
    if (hasCategory(name)) return

    categories.value.push(name)

    try {
      await $client.category.create.mutate({ name })
    } catch (error) {
      categories.value = categories.value.filter(
        (category) => category !== name
      )
    }
  }

  const fetchCategories = async () => {
    if (!auth.isLoggedIn) return

    try {
      const { data } = await $client.category.list.useQuery()

      // FIXME: This is a workaround for and issue where the data is not available immediately
      //        after the query is called
      await new Promise((resolve) => setTimeout(resolve, 50))

      if (!data?.value) return

      categories.value = data.value.map((category) => category.name)
    } catch (error) {
      console.error(error)
    }
  }

  fetchCategories()

  return {
    categories: skipHydrate(categories),
    isEmpty,
    hasCategory,
    addCategory,
    fetchCategories,
  }
})
