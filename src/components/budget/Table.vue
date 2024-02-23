<template>
  <UITable>
    <UITableHeader>
      <UITableHead>Category</UITableHead>
      <UITableHead>Amount</UITableHead>
    </UITableHeader>
    <UITableBody>
      <BudgetTableRow
        v-for="category in categories.categories"
        :key="category"
        :category="category"
      />
    </UITableBody>
  </UITable>
</template>

<script lang="ts" setup>
const categories = useCategoryStore()
</script>
