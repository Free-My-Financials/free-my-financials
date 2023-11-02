<template>
<div>
  <p>All of the other stuff</p>
  <button @click="val++">{{ val }}</button>
  <NuxtLink to="transaction/add">add</NuxtLink>
  <NuxtLink to="transaction/history">history</NuxtLink>
</div>
</template>

<script lang="ts" setup>
const val = ref(0)
</script>
