<template>
  <span :class="amount < 0 ? 'text-red-600' : 'text-green-600'">
    {{ amount < 0 ? '-' : '' }}${{ Math.abs(amount / 100).toFixed(2) }}
  </span>
</template>

<script lang="ts" setup>
defineProps({
  amount: {
    type: Number,
    required: true,
  },
})
</script>
