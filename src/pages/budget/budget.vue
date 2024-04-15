<template>
  <div class="page-container" :style="pageStyles">
    <div class="budget-container">
      <div class="budget-creation">
        <UForm :state="state" @submit="submit">
          <UFormGroup label="Click to create a new budget">
            <UCheckbox v-model="state.newBudget" name="newBudget" />
          </UFormGroup>
          <UFormGroup label="Name">
            <UInput
              id="name"
              v-model="state.name"
              name="name"
              :placeholder="'Name of Budget'"
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
              :placeholder="'Budget Total'"
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

      <div class="budget-transactions">
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
              <span>
                {{
                  new Date(row.date.toString()).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                }}
              </span>
            </template>
          </UTable>
        </div>
        <UButton
          type="button"
          class="nav-button"
          @click="printDiv('budget-page')"
        >
          Print Your budget
        </UButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const budget = useBudgetStore()

const state = reactive({
  newBudget: false,
  amount: '',
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
    formatter: formatDate,
  },
]

const pageStyles = computed(() => {
  let gradientColor = 'rgba(90, 90, 90, 0.1)'
  const fallbackColor = 'rgba(28, 28, 28, 0.1)'
  if (budget.totalBalance > 0) {
    gradientColor = 'rgba(39, 174, 96, 0.1)'
  } else if (budget.totalBalance < 0) {
    gradientColor = 'rgba(255, 0, 0, 0.1)'
  }

  return {
    background: `radial-gradient(circle at right center, ${gradientColor}, ${fallbackColor})`,
    marginBottom: '20px',
    borderRadius: '10px',
    color: 'white',
  }
})

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

onMounted(() => {
  budget.fetchBudget()
})

function formatDate(date) {
  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }
  return new Date(date)
    .toLocaleDateString('en-US', options)
    .replace(/(\d+)(st|nd|rd|th)/, '$1,')
}
</script>

<style scoped>
.page-container {
  display: flex;
  gap: 20px;
}
.budget-container {
  display: flex;
  width: 100%;
}
.budget-creation {
  flex: 1;
  margin-right: 20px;
}
.budget-transactions {
  flex: 1;
}
</style>
