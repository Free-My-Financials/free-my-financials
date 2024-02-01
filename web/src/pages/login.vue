<template>
<h1>Sign in</h1>
<a href="/auth/login/github">Sign in with GitHub</a>

<button @click.prevent="auth.login">Sign in with GitHub</button>
</template>

<script lang="ts" setup>
const auth = useAuthStore()
</script>
