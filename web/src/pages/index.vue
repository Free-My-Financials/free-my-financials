<template>
<div>
  <p>All of the other stuff</p>
  <button @click="val++">{{ val }}</button>
</div>
</template>

<script lang="ts" setup>
const val = ref(0)
</script>
