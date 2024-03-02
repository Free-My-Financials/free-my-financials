import { expect, test, vi } from 'vitest'
import prisma from '~/server/utils/prisma/__mocks__'
import {
  createBudget,
  createDefaultBudget,
  getBudgetsByUserId,
  updateBudgetById,
} from '~/server/utils/prisma/budget'

vi.mock('~/server/utils/prisma')

const user = {
  id: 'Hi',
  username: 'WhatIfPandoraHitBy35Planes',
  createdAt: new Date('2024-06-15'),
  updatedAt: new Date('2024-06-15'),
  transactions: [],
  budgets: [],
  categories: [],
  stores: [],
  // Auth
  githubId: 99,
  sessions: [],
}

const budget = {
  name: 'Budget',
  amount: 999,
  start: new Date('2024-06-15'),
  end: new Date('2024-06-15'),
}

const BudgetReturn = {
  id: 'hi',
  name: 'Budget',
  amount: 0,
  start: new Date('2024-06-15'),
  end: new Date('2024-06-15'),
  createdAt: new Date('2024-06-15'),
  updatedAt: new Date('2024-06-15'),
  user: user,
  userId: user.id,
}

const UpdatedBudget = {
  id: BudgetReturn.id,
  name: 'Personal Budget',
  amount: 1000,
  start: new Date('2024-09-15'),
  end: new Date('2024-10-15'),
  createdAt: new Date('2024-06-15'),
  updatedAt: new Date('2024-09-15'),
  user: user,
  userId: user.id,
}

test('Budget creation should return that same budget', async () => {
  prisma.budget.create.mockResolvedValue(BudgetReturn)
  const testBudget = await createBudget(user.id, budget)
  expect(testBudget.id).toEqual(BudgetReturn.id)
})

test('Getting a budget by user Id should return the correct budget', async () => {
  prisma.budget.findMany.mockResolvedValue([BudgetReturn])
  const testBudget = (await getBudgetsByUserId(user.id))[0]
  expect(testBudget.id).toEqual(BudgetReturn.id)
})

test('Updating a budget by user Id should have the updated amount', async () => {
  prisma.budget.update.mockResolvedValue(UpdatedBudget)
  const testBudget = await updateBudgetById(BudgetReturn.id, {
    name: 'Personal Budget',
    amount: 1000,
    start: new Date('2024-09-15'),
    end: new Date('2024-10-15'),
  })
  expect(testBudget?.amount).toEqual(UpdatedBudget.amount)
})

test('Create the defaultBudget', async () => {
  prisma.budget.create.mockResolvedValue(BudgetReturn)
  const testBudget = await createDefaultBudget(user.id)
  expect(testBudget?.id).toEqual(BudgetReturn.id)
})
