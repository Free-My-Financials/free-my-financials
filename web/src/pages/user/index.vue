<template>
<div>
  <UContainer :ui="{ constrained: 'max-w-4xl' }">
    <h1>Test Register/Login User</h1>
    <p>{{ auth.isLoggedIn ? auth.user?.username : "UNDEFINED" }}</p>
    <UInput v - model=" username" />
    <UContainer :ui="{ constrained: 'max-w-xl' }">
      <UButton @click="auth.register(username)" block label="Register" />
      <UButton @click="auth.login(username)" block label="Login" />
      <UButton @click="auth.logout()" block label="Logout" />
    </UContainer>
  </UContainer>

</div>
</template>

<script lang="ts" setup>
const auth = useAuthStore()
const username = ref('')
</script>
