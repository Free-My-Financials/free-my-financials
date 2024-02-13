import { describe, test, expect } from 'vitest'

describe('Categories Store', () => {
  test('fetchCategories reutrns nothing if not logged in', async () => {
    const categories = useCategoryStore()
    categories.fetchCategories()
    expect(categories.categories).toEqual([])
  })

  test('categories is empty if  not logged in and nothing has been added', async () => {
    const categories = useCategoryStore()
    expect(categories.isEmpty).toBeTruthy()
  })

  test('addCategory works', async () => {
    const categories = useCategoryStore()
    categories.addCategory('orange')

    expect(categories.categories).toEqual(['orange'])
  })

  test('addCategory wont store duplicates', async () => {
    const categories = useCategoryStore()
    categories.addCategory('orange')
    categories.addCategory('orange')

    expect(categories.categories).toEqual(['orange'])
  })
})
