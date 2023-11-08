<template>
<NuxtLink to="/">home</NuxtLink>
<h3>TOTAL BALANCE:
  <DollarAmount :amount="calculateTotalBalance" />
</h3>
<UTable :sort="{ 'column': 'Transaction_Date', direction: 'desc' }" :rows="transactions" :columns="columns">
  <template #Amount-data="{ row }">
    <DollarAmount :amount="row.Amount * (row.Type == 'expense' ? -1 : 1)" />
  </template>
  <template #Delete-data="{ row }">
    <UButton @click="deleteTransaction(row.Key)">Delete</UButton>
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
},
{
  key: 'Delete',
  label: 'Delete',
  sortable: false,
}
]

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

function deleteTransaction(key: number) {
  const index = transactions.value.findIndex(transaction => transaction.Key === key);
  if (index !== -1) {
    transactions.value.splice(index, 1);
    updateLocalStorage();
  }
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions.value));
}


</script>
