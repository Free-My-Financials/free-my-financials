<template>
<div class="page-container">
  <div class="table-container">
    <h3>TOTAL BALANCE:
      <DollarAmount :amount="calculateTotalBalance" />
    </h3>
    <h3 v-if="searchQuery !== ''">FILTERED TOTAL:
      <DollarAmount :amount="calculateFilteredTotalBalance" />
    </h3>
    <UTable :sort="{ 'column': 'date', direction: 'desc' }" :rows="filteredTransactions" :columns="columns"
      style="width: 100%">
      <template #amount-data="{ row }">
        <DollarAmount :amount="row.amount * (row.type == TransactionType.EXPENSE ? -1 : 1)" />
      </template>
      <template #category-data="{ row }">
        <span>{{ row.type === TransactionType.INCOME ? 'Income' : row.category }}</span>
      </template>
      <template #delete-data="{ row }">
        <UButton icon="i-heroicons-trash-20-solid" @click="confirmDeleteTransaction(row.id)" />
      </template>
      <template #date-data="{ row }">
        <span>{{ (new Date(row.date.toString())).toDateString() }}</span>
      </template>
    </UTable>
  </div>
  <div class="search-container">
    <input v-model="searchQuery" placeholder="Search transactions by store or category" style="width: 100%" />
  </div>
</div>
</template>

<style scoped>
.page-container {
  display: flex;
}

.table-container {
  flex: 1;
  margin-right: 20px;
}

.search-container {
  border-radius: 25px;
  box-shadow: 0px 0px 0px;
  width: 100%;
  height: 2.5rem;
  padding-top: 20px;
  box-shadow: 0px 0px 0px;
  width: 25%;
  font-size: 16px;
  line-height: 125%;
  display: flex;
}

.search-container:hover {
  border-radius: 25px;
}
</style>


<script setup>
import { ref, computed, watch } from 'vue';
import useTransactions, { TransactionType } from '~/composables/useTransactions';

const transactions = useTransactions();
const searchQuery = ref('');

const columns = [{
  key: 'store',
  label: 'Store',
  class: 'italic',
  sortable: true,
},
{
  key: 'category',
  label: 'Category',
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

const calculateFilteredTotalBalance = computed(() => {
  let total = 0;

  for (const transaction of filteredTransactions.value) {
    if (transaction.type === TransactionType.EXPENSE) total -= Number(transaction.amount);
    else if (transaction.type === TransactionType.INCOME) total += Number(transaction.amount);
  }

  return total;
});

const filteredTransactions = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return transactions.value.filter((transaction) => {
    return (
      transaction.store.toLowerCase().includes(query) ||
      transaction.category.toLowerCase().includes(query) ||
      transaction.amount.toString().includes(query) ||
      transaction.date.toString().includes(query)
    );
  });
});

function deleteTransaction(id) {
  const index = transactions.value.findIndex((transaction) => transaction.id === id);

  if (index === -1) return;

  transactions.value.splice(index, 1);
}

function confirmDeleteTransaction(id) {
  const isConfirmed = window.confirm('Are you sure you want to delete this transaction?');

  if (isConfirmed) {
    deleteTransaction(id);
  }
}
</script>
