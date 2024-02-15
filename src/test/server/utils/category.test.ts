import { expect, test, vi } from 'vitest'
import prisma from '~/server/utils/prisma/__mocks__'
import {
  createCategory,
  createDefaultCategories,
} from '~/server/utils/prisma/category'

vi.mock('~/server/utils/prisma')

const category = {
  id: 'Pandora',
  name: 'IsVery',
  createdAt: new Date('2024-06-15'),
  updatedAt: new Date('2024-06-15'),
  userId: 'Sleepy',
}

const defaultCategories = [
  {
    id: 'Food',
    name: 'IsVery',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-15'),
    userId: 'Sleepy',
  },
  {
    id: 'Clothing',
    name: 'IsVery',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-15'),
    userId: 'Sleepy',
  },
  {
    id: 'Entertainment',
    name: 'IsVery',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-15'),
    userId: 'Sleepy',
  },
]

test('Default Category creation should return that same category', async () => {
  prisma.category.create.mockResolvedValueOnce({ ...defaultCategories[0] })
  prisma.category.create.mockResolvedValueOnce({ ...defaultCategories[1] })
  prisma.category.create.mockResolvedValueOnce({ ...defaultCategories[2] })
  const testCategories = await createDefaultCategories('Sleepy')
  expect(testCategories).toEqual(defaultCategories)
})
