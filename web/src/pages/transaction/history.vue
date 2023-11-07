<template>
<NuxtLink to="/">home</NuxtLink>
<h3>TOTAL BALANCE:
  <DollarAmount :amount="calculateTotalBalance" />
</h3>
<UTable :sort="{ 'column': 'Transaction_Date', direction: 'desc' }" :rows="transactions" :columns="columns">
  <template #Amount-data="{ row }">
    <DollarAmount :amount="row.Amount * (row.Type == 'expense' ? -1 : 1)" />
  </template>
</UTable>
</template>

<script lang="ts" setup>
type transaction = {
  Key: number,
  Store: string,
  Amount: number,
  Type: string,
  Transaction_Date: number
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

const calculateTotalBalance = computed(() =>
  transactions.value.reduce((total, transaction) => {
    return transaction.Type === 'expense' ? total - transaction.Amount : total + transaction.Amount;
  }, 0)
);

</script>
