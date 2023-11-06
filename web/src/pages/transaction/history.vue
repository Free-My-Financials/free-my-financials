<template>
<NuxtLink to="/">home</NuxtLink>
<h3>TOTAL BALANCE: <DollarAmount :amount="transactions.reduce<number>((a, b) => a - b.Amount, 0)" /></h3>
<UTable :sort="{ 'column': 'Transaction_Date', direction: 'desc' }" :rows="transactions" :columns="columns">
  <template #Amount-data="{ row }">
    <DollarAmount :amount="-row.Amount" />
  </template>
</UTable>
</template>

<script lang="ts" setup>
type transaction = {
  Key: number,
  Store: string,
  Amount: number,
  Transaction_Date: number,
}

const columns = [{
  key: 'Store',
  label: 'Store',
  class: 'italic',
  sortable: true,
}, {
  key: 'Amount',
  label: 'Amount',
  sortable: true,
}, {
  key: 'Transaction_Date',
  label: 'Date',
  sortable: true,
}]

const transactions = useCookie(
  "transactions",
  {
    default: (): transaction[] => []
  }
)
</script>
