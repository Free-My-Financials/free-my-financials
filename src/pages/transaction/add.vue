<template>
  <UForm :state="state" @submit="submit">
    <UFormGroup label="Type of Transaction">
      <USelect v-model="state.type" :options="Object.values(TransactionType)" />
    </UFormGroup>

    <UFormGroup
      :label="
        state.type === TransactionType.INCOME
          ? 'Source of Income'
          : 'Place of Purchase'
      "
    >
      <UInput
        id="store"
        v-model="state.store"
        type="text"
        name="Store"
        :placeholder="
          state.type === TransactionType.INCOME
            ? 'Source of Income'
            : 'Place of Purchase'
        "
      />
    </UFormGroup>

    <UFormGroup v-if="state.type === TransactionType.EXPENSE" label="Category">
      <USelect
        v-if="!state.customCategory"
        v-model="state.category"
        :options="filteredCategories"
        :placeholder="'Category of Purchase'"
      />

      <UInput
        v-if="state.customCategory"
        id="customCategory"
        :key="state.customCategory.toString()"
        v-model="state.customCategoryName"
        type="text"
        name="CustomCategory"
        :placeholder="'Category'"
      />
      <div style="display: flex; align-items: center; margin-top: 8px">
        <UCheckbox v-model="state.customCategory" />
        <label style="margin-left: 8px">Click to enter a custom category</label>
      </div>
    </UFormGroup>

    <UFormGroup label="Amount">
      <UInput
        id="amount"
        v-model="state.amount"
        type="number"
        step="0.01"
        min="0"
        name="Amount"
        :placeholder="
          state.type === TransactionType.INCOME
            ? 'Amount Gained'
            : 'Amount Spent'
        "
      />
    </UFormGroup>

    <UFormGroup label="Date">
      <UInput id="date" v-model="state.date" type="date" name="Date" />
      <div style="display: flex; align-items: center; margin-top: 8px">
        <UCheckbox v-model="state.isRecurring" />
        <label style="margin-left: 8px">Is this transaction recurring?</label>
      </div>
    </UFormGroup>

    <UButton type="submit"> Submit </UButton>
  </UForm>
</template>

<script lang="ts" setup>
const transactions = useTransactionStore()
const catagories = useCategoryStore()
const toast = useToast()
const filteredCategories = computed(() => {
  return catagories.categories.filter((category) => category.trim() !== '')
})
const state = reactive({
  store: '',
  amount: '',
  date: '',
  type: TransactionType.EXPENSE,
  category: '',
  customCategory: false,
  customCategoryName: '',
  isRecurring: false,
})

const canSubmit = computed(() => {
  const requiredFieldsFilled = state.store && state.amount !== '' && state.date
  const validCategorySelected =
    state.type === TransactionType.EXPENSE
      ? (state.category !== null && state.category !== '') ||
        state.customCategory
      : true
  return (
    requiredFieldsFilled &&
    validCategorySelected &&
    (state.customCategory ? state.customCategoryName.trim() !== '' : true)
  )
})

async function submit() {
  if (!canSubmit.value) {
    toast.add({
      title: 'Invalid Input',
      description: 'Please fill in all the fields.',
    })

    return
  }

  const parsedAmount = parseFloat(state.amount)

  if (isNaN(parsedAmount)) return

  if (
    !(await transactions.addTransaction({
      id: Math.random().toString(36).substring(7),
      type: state.type,
      store: state.store,
      amount: Math.round(parsedAmount * 100),
      date: new Date(state.date + 'T00:00:00'),
      category: state.customCategory
        ? state.customCategoryName
        : state.category,
      budgetId: '',
    }))
  )
    return

  catagories.fetchCategories()

  resetState()
  toast.add({
    title: 'Success',
    description: 'Transaction added successfully!',
  })
}
function toggleRecurring() {
  state.isRecurring = !state.isRecurring
}
function resetState() {
  state.store = ''
  state.amount = ''
  state.date = ''
  state.type = TransactionType.EXPENSE
  state.category = ''
  state.customCategory = false
  state.customCategoryName = ''
}
</script>
