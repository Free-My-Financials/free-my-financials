import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import type { AppRouter } from '~/server/trpc/routers'

export default defineNuxtPlugin(() => {
  const headers = useRequestHeaders()

  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        headers: () => headers,
      }),
    ],
  })

  return {
    provide: {
      client,
    },
  }
})
