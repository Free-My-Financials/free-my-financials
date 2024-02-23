import { skipHydrate } from 'pinia'

interface User {
  id: string
  username: string
}

export const useAuthStore = defineStore('auth', () => {
  const { $client } = useNuxtApp()

  const user = ref<User | null>(null)

  const register = async () => {
    location.href = '/auth/login/github'
  }

  const login = async () => {
    location.href = '/auth/login/github'
  }

  const logout = async () => {
    await useFetch('/api/auth/logout', {
      method: 'POST',
    })

    user.value = null

    await navigateTo('/login')
  }

  const isLoggedIn = computed(() => !!user.value)

  const setUser = (newUser: User) => (user.value = newUser)

  const fetchUser = async () => {
    const { data } = await $client.user.get.useQuery()

    if (!data.value?.user) return

    setUser(data.value.user)
  }

  fetchUser()

  return {
    user: skipHydrate(user),
    register,
    login,
    logout,
    isLoggedIn,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
