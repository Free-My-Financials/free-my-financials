import { router } from '../trpc'
import hello from './hello'
import user from './user'
import transaction from './transaction'
import category from './category'

export const appRouter = router({
  hello,
  user,
  transaction,
  category,
})

// export type definition of API
export type AppRouter = typeof appRouter
