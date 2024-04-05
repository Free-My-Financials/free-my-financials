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
        <UCheckbox v-model="state.isRecurring" @change="toggleRecurring" />
        <label style="margin-left: 8px">Is this transaction recurring?</label>
      </div>
      <UFormGroup v-if="state.isRecurring" label="Recurrence">
        <USelect v-model="state.recurrenceType" :options="recurrenceOptions" />
      </UFormGroup>
    </UFormGroup>

    <UButton type="submit"> Submit </UButton>
  </UForm>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
const recurrenceOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'monthly', label: 'Monthly' },
]
const catagories = useCategoryStore()
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
  recurrenceType: '',
})

const transactions = useTransactionStore()
const toast = useToast()

const canSubmit = computed(() => {
  const requiredFieldsFilled = state.store && state.amount !== '' && state.date
  const validCategorySelected =
    state.type === TransactionType.EXPENSE
      ? (state.category !== null && state.category !== '') ||
        state.customCategory
      : true
  const validRecurrenceSelected =
    !state.isRecurring || state.recurrenceType !== ''

  return (
    requiredFieldsFilled &&
    validCategorySelected &&
    (state.customCategory ? state.customCategoryName.trim() !== '' : true) &&
    validRecurrenceSelected
  )
})

async function submit() {
  if (!canSubmit.value) {
    toast.add({
      title: 'Invalid Input',
      description: 'Please fill in all the fields.',
    })
    return
  } else {
    toast.add({
      title: 'Success',
      description: 'Transaction added successfully.',
    })
  }
  const parsedAmount = parseFloat(state.amount)

  if (isNaN(parsedAmount)) return

  const transactionDate = new Date(state.date + 'T00:00:00')
  const recurrenceEndDate = new Date(new Date().getFullYear(), 11, 31)

  let success = false

  if (!state.isRecurring) {
    success = await transactions.addTransaction({
      id: Math.random().toString(36).substring(7),
      type: state.type,
      store: state.store,
      amount: Math.round(parsedAmount * 100),
      date: transactionDate,
      category: state.customCategory
        ? state.customCategoryName
        : state.category,
      budgetId: '',
    })
  } else {
    // Handle recurring transaction
    const recurrenceType = state.recurrenceType
    let currentDate = new Date(transactionDate)

    while (currentDate <= recurrenceEndDate) {
      success = await transactions.addTransaction({
        id: Math.random().toString(36).substring(7),
        type: state.type,
        store: state.store,
        amount: Math.round(parsedAmount * 100),
        date: currentDate,
        category: state.customCategory
          ? state.customCategoryName
          : state.category,
        budgetId: '',
      })

      switch (recurrenceType) {
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7)
          break
        case 'biweekly':
          currentDate.setDate(currentDate.getDate() + 14)
          break
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1)
          break
        default:
          break
      }
    }
  }

  if (success) {
    catagories.fetchCategories()
    resetState(state)
    toast.add({
      title: 'Success',
      description: state.isRecurring
        ? `${addedTransactions} recurring transactions added successfully!`
        : 'Transaction added successfully!',
    })
  } else {
    toast.add({
      title: 'Error',
      description: 'Failed to add transaction.',
    })
  }
}
</script>
