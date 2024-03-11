import { expect, test, vi } from 'vitest'
import prisma from '~/server/utils/prisma/__mocks__'
import {
  createCategory,
  createDefaultCategories,
  createOrGetCategory,
  getCategoriesByBudgetId,
  getCategoryById,
  getCategoryByBudgetIdAndName,
} from '~/server/utils/prisma/category'

vi.mock('~/server/utils/prisma')

const category = {
  id: 'Pandora',
  name: 'IsVery',
  createdAt: new Date('2024-06-15'),
  updatedAt: new Date('2024-06-15'),
  budgetId: 'Sleepy',
}

const defaultCategories = [
  {
    id: 'Food',
    name: 'Food',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-15'),
    budgetId: 'Sleepy',
  },
  {
    id: 'Clothing',
    name: 'Clothing',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-15'),
    budgetId: 'Sleepy',
  },
  {
    id: 'Entertainment',
    name: 'Entertainment',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-15'),
    budgetId: 'Sleepy',
  },
]

test('Default Category creation should return the defaults', async () => {
  prisma.category.create.mockResolvedValueOnce(defaultCategories[0])
  prisma.category.create.mockResolvedValueOnce(defaultCategories[1])
  prisma.category.create.mockResolvedValueOnce(defaultCategories[2])
  const testCategories = await createDefaultCategories('Sleepy')
  expect(testCategories).toEqual(defaultCategories)
})

test('Category creation should return the same category', async () => {
  prisma.category.create.mockResolvedValueOnce(category)
  const testCategory = await createCategory('Sleepy', 'IsVery')
  expect(testCategory).toEqual(category)
})

test('createOrGetCategory returns existing category when it exists', async () => {
  prisma.category.findUnique.mockResolvedValueOnce(category)
  const testCategory = await createOrGetCategory('Sleepy', 'IsVery')
  expect(testCategory).toEqual(category)
})

test('createOrGetCategory returns created category when it is made', async () => {
  prisma.category.create.mockResolvedValueOnce(category)
  const testCategory = await createOrGetCategory('Sleepy', 'IsVery')
  expect(testCategory).toEqual(category)
})

test('getCategoriesByUserId returns users categories', async () => {
  prisma.category.findMany.mockResolvedValueOnce(defaultCategories)
  const testCategories = await getCategoriesByBudgetId('Sleepy')
  expect(testCategories).toEqual(defaultCategories)
})

test('getCategoryById returns the correct category', async () => {
  prisma.category.findUnique.mockResolvedValueOnce(category)
  const testCategory = await getCategoryById('Pandora')
  expect(testCategory).toEqual(category)
})

test('getCategoryByUserIdAndName returns the correct category', async () => {
  prisma.category.findUnique.mockResolvedValueOnce(category)
  const testCategory = await getCategoryByBudgetIdAndName('Sleep', 'IsVery')
  expect(testCategory).toEqual(category)
})
