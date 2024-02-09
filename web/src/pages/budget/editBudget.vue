<template>
  <UForm
    :state="state"
    @submit="submit"
  >
    <UFormGroup label="Budget Total">
      <UInput
        id="amount"
        v-model="state.amount"
        type="number"
        step="0.01"
        min="0"
        name="Amount"
      />
    </UFormGroup>

    <UFormGroup label="Start Date">
      <UInput
        id="date"
        v-model="state.startDate"
        type="date"
        name="Date"
      />
    </UFormGroup>
    <UFormGroup label="End Date">
      <UInput
        id="date"
        v-model="state.endDate"
        type="date"
        name="Date"
      />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>

<script lang="ts" setup>
const budget = useBudgetStore()
const toast = useToast()

const state = reactive({
  amount: 0,
  startDate: '',
  endDate: '',
})

async function submit() {
  if (state.amount && state.startDate && state.endDate) {
    budget.setBudget({
      amount: Math.round(state.amount * 100),
      startDate: new Date(state.startDate + 'T00:00:00'),
      endDate: new Date(state.endDate + 'T00:00:00'),
    })
    resetState()
    toast.add({
      title: 'Success',
      description: 'Budget edit successfully!',
    })
  } else {
    toast.add({
      title: 'Invalid Input',
      description: 'Please fill in all the fields.',
    })
  }
}

function resetState() {
  state.amount = 0
  state.startDate = ''
  state.endDate = ''
}
</script>
