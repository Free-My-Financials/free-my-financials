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

  const fetchRegister = async (username: string) => {
    try {
      const result = await $client.user.create.mutate({ username })

      return result
    } catch (error) {
      sendError()
    }
  }

  const register = async (username: string) => {
    const result = await fetchRegister(username)

    if (!result) {
      sendError()
      return
    }

    token.value = result.token
    setUser(result.user)
  }

  const fetchLogin = async (username: string) => {
    try {
      const { data } = await $client.user.login.useQuery({ username })

      return data
    } catch (error) {
      sendError()
    }
  }

  const login = async (username: string) => {
    const result = await fetchLogin(username)

    if (!result?.value) {
      sendError()
      return
    }

    token.value = result.value.token
    setUser(result.value.user)
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

  const sendError = () => {
    toast.add({
      title: 'Error',
      description: 'Something went wrong',
    })
  }

  return {
    user,
    register,
    fetchLogin,
    login,
    logout,
    isLoggedIn,
  }
})
