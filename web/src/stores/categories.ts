import { skipHydrate } from 'pinia'

export const useCategoryStore = defineStore('categories', () => {
  const auth = useAuthStore()
  const { $client } = useNuxtApp()
  const toast = useToast()

  const categories = ref<string[]>([])

  const isEmpty = computed(() => categories.value.length === 0)
  const hasCategory = (name: string) => categories.value.includes(name)

  const addCategory = async (name: string) => {
    if (hasCategory(name))
      return

    categories.value.push(name)

    try {
      await $client.category.create.mutate({ name })
    } catch (error) {
      categories.value = categories.value.filter((category) => category !== name)

      toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })
    }
  }

  const fetchCategories = async () => {
    if (!auth.isLoggedIn)
      return

    try {
      const { data } = await $client.category.list.useQuery()

      console.log('data', data)
      console.log('data.value', data?.value)

      if (!data?.value) {
        console.log('no data')
        return toast.add({
          title: 'Error',
          description: 'Something went wrong',
        })
      }

      categories.value = data.value.map((category) => category.name)

      console.log('categories', categories.value)
    } catch (error) {
      return toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })
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
