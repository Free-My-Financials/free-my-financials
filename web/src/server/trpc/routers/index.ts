import { router } from '../trpc'
import hello from './hello'
import user from './user'
import transaction from './transaction'

export const appRouter = router({
  hello,
  user,
  transaction,
})

// export type definition of API
export type AppRouter = typeof appRouter
