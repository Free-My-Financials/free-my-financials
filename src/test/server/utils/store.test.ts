import { expect, test, vi } from 'vitest'
import prisma from '~/server/utils/prisma/__mocks__'
import { createStore, createOrGetStore } from '~/server/utils/prisma/store'

vi.mock('~/server/utils/prisma')

const store = {
  id: '1738',
  name: 'The Milk Store',
  createdAt: new Date('2024-06-15'),
  updatedAt: new Date('2024-06-15'),
  userId: 'NotPandora',
}

test('Store creation should return the same store', async () => {
  prisma.store.create.mockResolvedValueOnce({ ...store })
  const testStore = await createStore('NotPandora', 'The Milk Store')
  expect(testStore).toEqual(store)
})

test('createOrGetStore should return the same store if it creates the store', async () => {
  prisma.store.create.mockResolvedValueOnce({ ...store })
  const testStore = await createOrGetStore('NotPandora', 'The Milk Store')
  expect(testStore).toEqual(store)
})

test('createOrGetStore should return the same store if the store exists', async () => {
  prisma.store.findUnique.mockResolvedValueOnce({ ...store })
  const testStore = await createOrGetStore('NotPandora', 'The Milk Store')
  expect(testStore).toEqual(store)
})
