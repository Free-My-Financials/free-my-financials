import { skipHydrate } from 'pinia'

export const useCategoryStore = defineStore('categories', () => {
  const categories = useCookie("categories", {
    default: () => ['Groceries', 'Clothing', 'Entertainment'],
    sameSite: "lax",
  })

  const isEmpty = computed(() => categories.value.length === 0)
  const hasCategory = (name: string) => categories.value.includes(name)

  const addCategory = (name: string) => {
    if (hasCategory(name))
      return

    categories.value.push(name)
  }

  return {
    categories: skipHydrate(categories),
    isEmpty,
    hasCategory,
    addCategory,
  }
})
