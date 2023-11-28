<script lang="ts" setup>
import useBudget from '~/composables/useBudget';


const start_date = ref(new Date(2023, 1, 1))
const amount = ref(0)
const end_date = ref(new Date(2023, 1, 1))


const budget = useBudget()
async function submit() {
  budget.value = [{ start_date: start_date.value, amount: amount.value, end_date: end_date.value }]
}
</script>


<template>
<h1>
  Edit Your Budget
</h1>
<form @submit.prevent="submit">
  <input type="number" name="Amount" id="amount" v-model="amount" />
  <input type="date" name="Start Date" id="date" v-model="start_date" />
  <input type="date" name="End Date" id="date" v-model="end_date" />
  <input type="submit" value="submit" />
</form>
</template>
