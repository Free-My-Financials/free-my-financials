import { router } from '../trpc'
import hello from './hello'
import user from './user'
import transaction from './transaction'
import category from './category'
import budget from './budget'

export const appRouter = router({
  hello,
  user,
  transaction,
  category,
  budget,
})

// export type definition of API
export type AppRouter = typeof appRouter
