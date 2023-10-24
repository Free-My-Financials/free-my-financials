<template>
<div>
  <h2>Budget</h2>
  <button @click="val++">{{ val }}</button>
</div>
</template>

<script lang="ts" setup>
const val = ref(0)
</script>
