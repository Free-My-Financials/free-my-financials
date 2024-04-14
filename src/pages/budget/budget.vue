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
        <UInput
          id="startDate"
          v-model="state.startDate"
          type="date"
          name="startDate"
        />
      </UFormGroup>
      <UFormGroup label="End Date">
        <UInput
          id="endDate"
          v-model="state.endDate"
          type="date"
          name="endDate"
        />
      </UFormGroup>

      <UButton type="submit"> Submit </UButton>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import printDiv from '~/utils/printDiv'
import { useBudgetStore } from '~/stores/budget'
import { reactive, onMounted } from 'vue'

const budget = useBudgetStore()
const toast = useToast()

const state = reactive({
  newBudget: false,
  amount: 0,
  startDate: '',
  endDate: '',
  name: '',
})

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

async function submit() {
  if (state.amount && state.startDate && state.endDate && state.name) {
    if (state.newBudget == true) {
      const new_budget = {
        name: state.name.toString(),
        amount: Math.round(state.amount * 100),
        start: new Date(state.startDate + 'T00:00:00'),
        end: new Date(state.endDate + 'T00:00:00'),
      }
      const created_budget = await budget.createNewBudget(new_budget)
      console.log(created_budget)
      if (created_budget != undefined) {
        budget.setBudget({
          id: created_budget.id,
          name: created_budget.name,
          startDate: new Date(created_budget.start),
          endDate: new Date(created_budget.end),
          amount: created_budget.amount,
        })
      }
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
