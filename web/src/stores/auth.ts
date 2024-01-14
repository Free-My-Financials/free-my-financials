import { set } from "nuxt/dist/app/compat/capi"

interface User {
  id: string
  username: string
}

export const useAuthStore = defineStore('auth', () => {
  const { $client } = useNuxtApp()
  const toast = useToast()

  const token = useCookie('authorization', {
    default: (): string | null => null,
    sameSite: 'lax'
  })

  const user = ref<User | null>(null)

  const register = async (username: string) => {
    try {
      const result = await $client.user.create.mutate({ username })

      if (!result) {
        return toast.add({
          title: 'Error',
          description: 'Something went wrong',
        })
      }

      token.value = result.token
      setUser(result.user)
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })
    }
  }

  const login = async (username: string) => {
    try {
      const { data } = await $client.user.login.useQuery({ username })

      if (!data.value) {
        return toast.add({
          title: 'Error',
          description: 'Something went wrong',
        })
      }

      token.value = data.value.token
      setUser(data.value.user)
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Something went wrong',
      })
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
  }

  const isLoggedIn = computed(() => token.value !== null)

  const setUser = (newUser: User) => user.value = newUser

  const getUser = async () => {
    if (!token.value)
      return

    const { data } = await $client.user.get.useQuery()

    if (!data.value?.user)
      return

    setUser(data.value.user)
  }

  getUser()

  return {
    user,
    register,
    login,
    logout,
    isLoggedIn,
  }
})
