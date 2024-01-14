import { router } from '../trpc'
import hello from './hello'
import user from './user'

export const appRouter = router({
  hello,
  user,
})

// export type definition of API
export type AppRouter = typeof appRouter
