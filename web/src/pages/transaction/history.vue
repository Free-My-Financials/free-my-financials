<template>
<h3> TOTAL BALANCE: {{ transactions.reduce<number>((a, b) => a - b.Amount, 0) }}</h3>
<table>
  <tr>
    <th>Store</th>
    <th>Amount</th>
    <th>Date</th>
  </tr>
  <tr v-for="transaction in transactions.sort((a, b) => a.Transaction_Date < b.Transaction_Date ? 1 : -1)"
    class="transaction">
    <td>{{ transaction.Store }}</td>
    <td>{{ transaction.Amount * -1 }}</td>
    <td>{{ transaction.Transaction_Date }}</td>
  </tr>
</table>
</template>

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

<style lang="scss" scoped>
table {
  width: 80%;

  td {
    text-align: center;
  }
}
</style>
