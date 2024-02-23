<template>
  <UITableRow>
    <UITableCell>{{ category }}</UITableCell>
    <UITableCell>
      <DollarAmount :amount="total" />
    </UITableCell>
    <UITableCell>
      <UIButton
        variant="ghost"
        size="icon"
        @click="console.log(`Open options for ${category}`)"
      >
        <MoreHorizontal />
      </UIButton>
    </UITableCell>
  </UITableRow>
</template>

<script lang="ts" setup>
import { MoreHorizontal } from 'lucide-vue-next'

const transactions = useTransactionStore()
const props = defineProps<{
  category: string
}>()

const categoryTransactions = transactions.getTransactionsByCategory(
  props.category
)

const total = computed(() => {
  return categoryTransactions.reduce((acc, transaction) => {
    return acc + transaction.amount
  }, 0)
})
</script>
