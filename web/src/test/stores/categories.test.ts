import { describe, test, expect } from 'vitest'

describe('Categories Store', () => {
  test('fetchCategories reutrns nothing if not logged in', async () => {
    const categories = useCategoryStore()
    categories.fetchCategories()
    expect(categories.categories).toEqual([]);
  })
})
