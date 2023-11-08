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
    <UButton @click="deleteTransaction(row.Key)">Remove Transaction</UButton>
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
  label: '',
  sortable: false,
}
]

const transactions = useCookie(
  "transactions",
  {
    default: (): transaction[] => []
  }
)

const calculateTotalBalance = computed(() => {
  let totalExpense = 0;
  let totalIncome = 0;

  transactions.value.forEach(transaction => {
    if (transaction.Type === 'expense') {
      totalExpense += transaction.Amount;
    } else if (transaction.Type === 'income') {
      totalIncome += transaction.Amount;
    }
  });

  return totalIncome - totalExpense;
});


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
