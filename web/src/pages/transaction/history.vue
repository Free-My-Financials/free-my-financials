<script lang="ts" setup>

type transaction = {
  Key: number,
  Store: string,
  Amount: number,
  Transaction_Date: number
}

const transactions = useCookie(
  "transactions",
  {
    default: (): transaction[] => []
  }
)

</script>

<template>
<p v-for="transaction in transactions">
  {{ transaction.Store }} ${{ transaction.Amount }} {{ transaction.Transaction_Date }}
</p>
</template>
