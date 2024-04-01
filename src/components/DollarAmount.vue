<template>
  <span :class="amount < 0 ? 'text-red-600' : 'text-green-600'">
    {{ numberToMoney(amount) }}
  </span>
</template>

<script lang="ts" setup>
import { numberToMoney } from '#imports'
defineProps({ amount: { type: Number, required: true } })
</script>
