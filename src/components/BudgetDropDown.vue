<template>
  <h3>
    Budget:
    <UBadge :label="budget.budget.name" />
    <UDropdown :items="budgetOptions" :popper="{ placement: 'bottom-start' }">
      <UButton
        color="white"
        label="Budgets"
        trailing-icon="i-heroicons-chevron-down-20-solid"
      />
    </UDropdown>
  </h3>
</template>

<script lang="ts" setup>
// THE FIRST LINK, that being "Create A New Budget" is created in // budget.createBudgetSelection(), so when the time comes to merge budget page and edit budget page, look there
const budget = useBudgetStore()
const budgetOptions = await budget.createBudgetSelection()
onMounted(() => {
  budget.fetchBudget()
})
</script>
