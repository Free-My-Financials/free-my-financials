


<template>
<h3>Start of budget:
  <UBadge :label="budget.start_date.toString()" />
</h3>
<h3>Start of budget:
  <UBadge :label="budget.end_date.toString()" />
</h3>
<h3>TOTAL BALANCE:
  <DollarAmount :amount="calculateTotalBalance" />
  <UBadge label="Out of" />
  <DollarAmount :amount="budget.amount" />
</h3>
<UTable :sort="{ 'column': 'date', direction: 'desc' }" :rows="transactions_in_budget" :columns="columns">
  <template #amount-data="{ row }">
    <DollarAmount :amount="row.amount * (row.type == TransactionType.EXPENSE ? -1 : 1)" />
  </template>
</UTable>
</template>

<script lang="ts" setup>
import useBudget from '~/composables/useBudget';
import useTransactions, { TransactionType, type Transaction } from '~/composables/useTransactions';

const transactions = useTransactions()
const budget = useBudget()
const get_transactions = ((): Transaction[] => {
  let new_transactions = []
  for (const transaction of transactions.value) {
    if (transaction.date > budget.value.start_date && transaction.date < budget.value.end_date) {
      new_transactions.push(transaction)
    }

  }
  return new_transactions
})
const transactions_in_budget: Transaction[] = get_transactions()

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
}]

const calculateTotalBalance = computed(() => {
  let total = 0

  for (const transaction of transactions_in_budget) {
    if (transaction.type === TransactionType.EXPENSE)
      total -= Number(transaction.amount)
    else if (transaction.type === TransactionType.INCOME)
      total += Number(transaction.amount)
  }

  return Number(budget.value.amount) + total
})

</script>
