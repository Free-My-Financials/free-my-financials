<template>
  <div class="page-container">
    <div class="table-container">
      <h3>
        TOTAL BALANCE:
        <DollarAmount :amount="transactions.totalBalance" />
      </h3>
      <h3 v-if="searchQuery !== ''">
        FILTERED TOTAL:
        <DollarAmount :amount="calculateFilteredTotalBalance" />
      </h3>
      <div v-if="filteredTransactions.length === 0">
        <p>No matching results for the search: "{{ searchQuery }}"</p>
      </div>
      <UTable
        v-else
        :sort="{ 'column': 'date', direction: 'desc' }"
        :rows="filteredTransactions"
        :columns="columns"
        style="width: 100%"
      >
        <template #amount-data="{ row }">
          <DollarAmount :amount="row.amount * (row.type == TransactionType.EXPENSE ? -1 : 1)" />
        </template>
        <template #category-data="{ row }">
          <span>{{ row.type === TransactionType.INCOME ? 'Income' : row.category }}</span>
        </template>
        <template #delete-data="{ row }">
          <UButton
            icon="i-heroicons-trash-20-solid"
            @click="confirmDeleteTransaction(row.id)"
          />
        </template>
        <template #date-data="{ row }">
          <span>{{ formatDate(row.date) }}</span>
        </template>
      </UTable>
    </div>
    <div class="search-container">
      <span class="search-icon">&#128269;</span>
      <input
        v-model="searchQuery"
        placeholder="Search transactions by store or category"
      >
    </div>
  </div>
</template>

<script setup>
const transactions = useTransactionStore()
const searchQuery = ref('')

const formatDate = (dateString) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const getFormattedDateComponents = (dateString) => {
  const date = new Date(dateString)
  return {
    day: date.toLocaleDateString(undefined, { day: 'numeric' }).toLowerCase(),
    month: date.toLocaleDateString(undefined, { month: 'short' }).toLowerCase(),
    year: date.toLocaleDateString(undefined, { year: 'numeric' }).toLowerCase(),
    weekday: date.toLocaleDateString(undefined, { weekday: 'short' }).toLowerCase(),
  }
}

const filteredTransactions = computed(() => {
  const queryWords = searchQuery.value.toLowerCase().split(/\s+/)
  return transactions.transactions.filter((transaction) => {
    const formattedDateComponents = getFormattedDateComponents(transaction.date)

    return queryWords.every((word) =>
      [
        transaction.store.toLowerCase(),
        transaction.category.toLowerCase(),
        transaction.amount.toString(),
        transaction.type.toLowerCase(),
        formattedDateComponents.day,
        formattedDateComponents.month,
        formattedDateComponents.year,
        formattedDateComponents.weekday,
      ].some((field) => field.includes(word))
    )
  })
})

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

const calculateFilteredTotalBalance = computed(() => {
  let total = 0

  for (const transaction of filteredTransactions.value) {
    if (transaction.type === TransactionType.EXPENSE) total -= Number(transaction.amount)
    else if (transaction.type === TransactionType.INCOME) total += Number(transaction.amount)
  }

  return total
})

function confirmDeleteTransaction(id) {
  const isConfirmed = window.confirm('Are you sure you want to delete this transaction?')

  if (isConfirmed)
    transactions.removeTransaction(id)
}
</script>


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
  padding-top: 10px;
  padding-left: 20px;
  height: 2.5rem;
  box-shadow: 0px 0px 0px;
  width: 35%;
  font-size: 16px;
  line-height: 125%;
  display: flex;
}

.search-container input {
  width: 100%;
  padding-left: 40px;
  left: -10px;
  border-radius: 15px;
}

.search-container:hover {
  border-radius: 25px;
}

.search-container .search-icon {
  position: relative;
  left: 25px;
  top: 5px;
  font-size: 18px;
  color: #555;
}
</style>
