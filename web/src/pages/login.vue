<template>
  <div>
    <br>
    <br>
    <br>
    <br>

    <a href="auth/login/github">Sign in with GitHub </a>
  </div>
</template>

<script lang="ts" setup>
const auth = useAuthStore()
</script>
<style scoped>
a:link {
  background-color: green;
  font-size: larger;
  padding: 14px 25px;
  text-align: center;
}

a:hover {
  background-color: lightgreen;
  font-size: larger;
  padding: 14px 25px;
  text-align: center;
}
</style>
