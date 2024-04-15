interface User {
  id: string
  username: string
}

export const useAuthStore = defineStore('auth', () => {
  const { $client } = useNuxtApp()

  const user = ref<User | null>(null)

  const login = async () => {
    location.href = '/auth/login/google'
  }

  const register = login

  const logout = async () => {
    await useFetch('/api/auth/logout', {
      method: 'POST',
    })

    user.value = null

    await navigateTo('/login')
  }

  const isLoggedIn = computed(() => user.value !== null)

  const setUser = (newUser: User) => (user.value = newUser)

  const fetchUser = async () => {
    if (isLoggedIn.value) return

    const { data } = await $client.user.get.useQuery()

    if (!data.value?.user) return

    setUser(data.value.user)
  }

  fetchUser()

  return {
    user,
    register,
    login,
    logout,
    isLoggedIn,
    fetchUser,
  }
})
