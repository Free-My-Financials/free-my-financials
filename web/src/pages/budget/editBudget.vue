<template>
<UForm :state="state" @submit="submit">
  <UFormGroup label="Budget Total">
    <UInput type="number" step="0.01" min="0" name="Amount" id="amount" v-model="state.amount" />
  </UFormGroup>

  <UFormGroup label="Start Date">
    <UInput type="date" name="Date" id="date" v-model="state.start_date" />
  </UFormGroup>
  <UFormGroup label="End Date">
    <UInput type="date" name="Date" id="date" v-model="state.end_date" />
  </UFormGroup>

  <UButton type="submit">Submit</UButton>
</UForm>
</template>

<script lang="ts" setup>
const budget = useBudget()
const toast = useToast()

const state = reactive({
  amount: 0,
  start_date: '',
  end_date: "",
})

async function submit() {
  if (state.amount && state.start_date && state.end_date) {
    budget.value = {
      amount: Math.round(state.amount * 100),
      start_date: new Date(state.start_date),
      end_date: new Date(state.end_date),
    }
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
  state.start_date = ''
  state.end_date = ""
}
</script>
