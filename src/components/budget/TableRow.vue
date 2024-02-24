<template>
  <UITableRow>
    <UITableCell>{{ category }}</UITableCell>
    <UITableCell>
      <DollarAmount :amount="amount" />
    </UITableCell>
    <UITableCell>
      <TransactionCreateDialog :category="category" />
    </UITableCell>
  </UITableRow>
</template>

<script lang="ts" setup>
const transactions = useTransactionStore()

const props = defineProps<{
  category: string
}>()

const amount = computed(() => {
  return transactions
    .getTransactionsByCategory(props.category)
    .reduce(
      (acc, transaction) =>
        transaction.type == TransactionType.EXPENSE
          ? acc - transaction.amount
          : acc + transaction.amount,
      0
    )
})
</script>
