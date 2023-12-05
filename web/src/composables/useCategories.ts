const preListedCategories = ['Groceries', 'Clothing', 'Entertainment'];
const customCategoryKey = 'customCategories';

export default function () {
  const categories: Ref<String[]> = ref(getCategories())

  return {
    categories,
    addCategory: (name: string) => {
      const newCategory = name.trim()

      if (newCategory.length == 0 || categories.value.includes(newCategory))
        return

      categories.value.push(newCategory)
      localStorage.setItem(customCategoryKey, JSON.stringify(categories.value))
    }
  }
}

const getCategories = (): string[] => {
  if (typeof localStorage !== 'undefined') {
    const customCategories = localStorage.getItem(customCategoryKey);

    return customCategories ? JSON.parse(customCategories) : preListedCategories;
  } else {
    return preListedCategories;
  }
}
