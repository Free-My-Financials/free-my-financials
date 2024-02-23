import { expect, test, vi } from 'vitest'
import prisma from '~/server/utils/prisma/__mocks__'
import {
  createStore,
  createOrGetStore,
  getStoresByUserId,
  getStoreByUserIdAndName,
} from '~/server/utils/prisma/store'

vi.mock('~/server/utils/prisma')

const store = {
  id: '1738',
  name: 'The Milk Store',
  createdAt: new Date('2024-06-15'),
  updatedAt: new Date('2024-06-15'),
  userId: 'NotPandora',
}

const storeArray = [
  {
    id: '1984',
    name: 'The Gun Store',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-15'),
    userId: 'NotPandora',
  },
  {
    id: 'hi there',
    name: 'Fortnite Item Shop',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-20'),
    userId: 'NotPandora',
  },
]

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

test('createOrGetStore should return the existing store if it already has the store', async () => {
  prisma.store.findUnique.mockResolvedValueOnce({ ...store })
  const testStore = await createOrGetStore('NotPandora', 'The Milk Store')
  expect(testStore).toEqual(store)
})

test('getStoresByUserId should return the correct array', async () => {
  prisma.store.findMany.mockResolvedValueOnce(storeArray)
  const testStores = await getStoresByUserId('NotPandora')
  expect(testStores).toEqual(storeArray)
})

test('getStoreByUserIdAndName should return the correct store', async () => {
  prisma.store.findUnique.mockResolvedValueOnce({ ...store })
  const testStore = await getStoreByUserIdAndName(
    'NotPandora',
    'The Milk Store'
  )
  expect(testStore).toEqual(store)
})
