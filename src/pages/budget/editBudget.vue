<template>
  <UForm :state="state" @submit="submit">
    <UFormGroup label="Click to create a new budget">
      <UCheckbox v-model="state.newBudget" name="newBudget" />
    </UFormGroup>
    <UFormGroup label="Name">
      <UInput
        id="name"
        v-model="state.name"
        name="name"
        :placeholder="budget.budget.name"
      />
    </UFormGroup>
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
      <UInput id="date" v-model="state.startDate" type="date" name="Date" />
    </UFormGroup>
    <UFormGroup label="End Date">
      <UInput id="date" v-model="state.endDate" type="date" name="Date" />
    </UFormGroup>

    <UButton type="submit"> Submit </UButton>
  </UForm>
</template>

<script lang="ts" setup>
import { useBudgetStore } from '~/stores/budget'

const budget = useBudgetStore()
const toast = useToast()

const state = reactive({
  newBudget: false,
  amount: 0,
  startDate: '',
  endDate: '',
  name: '',
})

async function submit() {
  if (state.amount && state.startDate && state.endDate && state.name) {
    if (state.newBudget == true) {
      budget.createNewBudget({
        name: state.name.toString(),
        amount: Math.round(state.amount * 100),
        start: new Date(state.startDate + 'T00:00:00'),
        end: new Date(state.endDate + 'T00:00:00'),
      })

      resetState()
      toast.add({
        title: 'Success',
        description: 'Budget created successfully!',
      })
    } else {
      budget.setBudget({
        id: budget.budget.id,
        name: state.name,
        amount: Math.round(state.amount * 100),
        startDate: new Date(state.startDate + 'T00:00:00'),
        endDate: new Date(state.endDate + 'T00:00:00'),
      })

      resetState()
      toast.add({
        title: 'Success',
        description: 'Budget edited successfully!',
      })
    }
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
  state.name = ''
}

onMounted(() => {
  budget.fetchBudget()
})
</script>
