<template>
<div>
  <h1>Test Register/Login User</h1>
  <p>{{ auth.isLoggedIn ? auth.user?.username : "UNDEFINED" }}</p>
  <input v-model="username" />
  <button @click="auth.register(username)">Register</button>
  <button @click="auth.login(username)">Login</button>
  <button @click="auth.logout()">Logout</button>
</div>
</template>

<script lang="ts" setup>
const auth = useAuthStore()
const username = ref('')
</script>
