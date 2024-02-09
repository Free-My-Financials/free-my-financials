import { TRPCError } from '@trpc/server'
import { middleware } from '~/server/trpc/trpc'

export const isAuthed = middleware(({ next, ctx }) => {
  if (!ctx.user)
    throw new TRPCError({ code: 'UNAUTHORIZED' })

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    }
  })
})
