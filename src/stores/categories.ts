import { skipHydrate } from 'pinia'

export const useCategoryStore = defineStore('categories', () => {
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
    try {
      const { data } = await $client.category.list.useQuery()

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

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCategoryStore, import.meta.hot))
