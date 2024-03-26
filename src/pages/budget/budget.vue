<template>
  <div>
    <div id="budget-page">
      <h3>
        Start of budget:
        <UBadge :label="budget.startDate.toDateString()" />
      </h3>
      <h3>
        End of budget:
        <UBadge :label="budget.endDate.toDateString()" />
      </h3>
      <h3>
        TOTAL BALANCE:
        <DollarAmount :amount="budget.totalBalance" />
        <UBadge label="Out of" />
        <DollarAmount :amount="budget.amount" />
      </h3>

      <UTable
        :sort="{ column: 'date', direction: 'desc' }"
        :rows="budget.transactions"
        :columns="columns"
      >
        <template #amount-data="{ row }">
          <DollarAmount
            :amount="
              row.amount * (row.type == TransactionType.EXPENSE ? -1 : 1)
            "
          />
        </template>
        <template #date-data="{ row }">
          <span>{{ new Date(row.date.toString()).toDateString() }}</span>
        </template>
      </UTable>
    </div>
    <UButton type="button" class="nav-button" @click="printDiv('budget-page')">
      Print Your budget
    </UButton>
  </div>
</template>

<script lang="ts" setup>
import printDiv from '~/utils/printDiv'

const budget = useBudgetStore()

const columns = [
  {
    key: 'store',
    label: 'Store',
    class: 'italic',
    sortable: true,
  },
  {
    key: 'amount',
    label: 'Amount',
    sortable: true,
  },
  {
    key: 'date',
    label: 'Date',
    sortable: true,
  },
]
onMounted(() => {
  budget.fetchBudget()
})
</script>
