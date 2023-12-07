
<template>
<h3>Start of budget:
  <UBadge :label="(new Date(budget.start_date.toString())).toDateString()" />
</h3>
<h3>End of budget:
  <UBadge :label="(new Date(budget.end_date.toString())).toDateString()" />
</h3>
<h3>TOTAL BALANCE:
  <DollarAmount :amount="budget_balance" />
  <UBadge label="Out of" />
  <DollarAmount :amount="budget.amount" />
</h3>
<UTable :sort="{ 'column': 'date', direction: 'desc' }" :rows="transactions_in_budget" :columns="columns">
  <template #amount-data="{ row }">
    <DollarAmount :amount="row.amount * (row.type == TransactionType.EXPENSE ? -1 : 1)" />
  </template>
  <template #date-data="{ row }">
    <span>{{ (new Date(row.date.toString())).toDateString() }}</span>
  </template>
</UTable>
</template>

<script lang="ts" setup>
import useBudget, { get_budget_transactions, calculateTotalBalance } from '~/composables/useBudget';
import useTransactions, { TransactionType, type Transaction } from '~/composables/useTransactions';


const transactions = useTransactions()
const budget = useBudget()
const transactions_in_budget: Transaction[] = get_budget_transactions(transactions.value, budget.value)
const budget_balance = calculateTotalBalance(transactions_in_budget, Number(budget.value.amount))

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


</script>
