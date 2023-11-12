<template>
<h3>TOTAL BALANCE:
  <DollarAmount :amount="calculateTotalBalance" />
</h3>
<UTable :sort="{ 'column': 'date', direction: 'desc' }" :rows="transactions" :columns="columns">
  <template #amount-data="{ row }">
    <DollarAmount :amount="row.amount * (row.type == TransactionType.EXPENSE ? -1 : 1)" />
  </template>
  <template #delete-data="{ row }">
    <UButton icon="i-heroicons-trash-20-solid" @click="deleteTransaction(row.id)" />
  </template>
</UTable>
</template>

<script lang="ts" setup>
const transactions = useTransactions()

const columns = [{
  key: 'store',
  label: 'Store',
  class: 'italic',
  sortable: true,
}, {
  key: 'amount',
  label: 'Amount',
  sortable: true,
}, {
  key: 'date',
  label: 'Date',
  sortable: true,
}, {
  key: 'delete',
  label: '',
  sortable: false,
}]

const calculateTotalBalance = computed(() => {
  let total = 0

  for (const transaction of transactions.value) {
    if (transaction.type === TransactionType.EXPENSE)
      total -= Number(transaction.amount)
    else if (transaction.type === TransactionType.INCOME)
      total += Number(transaction.amount)
  }

  return total
})

function deleteTransaction(id: number) {
  const index = transactions.value.findIndex(transaction => transaction.id === id)

  if (index == -1)
    return

  transactions.value.splice(index, 1)
}
</script>
