<template>
  <div class="page-container" :style="pageStyles">
    <div class="form-container">
      <UForm :state="state" @submit="submit">
        <UFormGroup label="Type of Transaction">
          <USelect
            v-model="state.type"
            :options="Object.values(TransactionType)"
          />
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

        <UFormGroup
          v-if="state.type === TransactionType.EXPENSE"
          label="Category"
        >
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
            <label style="margin-left: 8px"
              >Click to enter a custom category</label
            >
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
            <label style="margin-left: 8px"
              >Is this transaction recurring?</label
            >
          </div>
          <UFormGroup v-if="state.isRecurring" label="Recurrence">
            <USelect
              v-model="state.recurrenceType"
              :options="recurrenceOptions"
            />
            <div
              v-if="state.recurrenceType !== ''"
              style="display: flex; flex-direction: column; margin-top: 8px"
            >
              <label for="recurrenceEndDate">End Date of Recurrence</label>
              <UInput
                id="recurrenceEndDate"
                v-model="state.recurrenceEndDate"
                type="date"
                name="RecurrenceEndDate"
                placeholder="End Date of Recurrence"
              />
            </div>
          </UFormGroup>
        </UFormGroup>

        <UButton type="submit"> Submit </UButton>
      </UForm>
    </div>
    <div v-if="transactions.transactions.length > 0" class="history-container">
      <div class="search-container">
        <span class="search-icon">&#128269;</span>
        <input
          v-model="searchQuery"
          placeholder="Search transactions by store or category"
        />
      </div>
      <div id="transaction-page" class="table-container">
        <h3>
          TOTAL BALANCE:
          <DollarAmount :amount="transactions.totalBalance" />
        </h3>
        <h3 v-if="searchQuery !== ''">
          FILTERED TOTAL:
          <DollarAmount :amount="calculateFilteredTotalBalance" />
        </h3>
        <div v-if="searchQuery !== '' && filteredTransactions.length === 0">
          <p>No matching results for the search: "{{ searchQuery }}"</p>
        </div>
        <UTable
          v-else
          :sort="{ column: 'date', direction: 'desc' }"
          :rows="filteredTransactions"
          :columns="columns"
          style="width: 100%"
        >
          <template #amount-data="{ row }">
            <DollarAmount
              :amount="
                row.amount * (row.type == TransactionType.EXPENSE ? -1 : 1)
              "
            />
          </template>
          <template #category-data="{ row }">
            <span>{{
              row.type === TransactionType.INCOME ? 'Income' : row.category
            }}</span>
          </template>
          <template #delete-data="{ row }">
            <div class="action-buttons">
              <UButton
                icon="i-heroicons-pencil-20-solid"
                @click="editTransaction(row.id)"
              />
              <UButton
                icon="i-heroicons-trash-20-solid"
                @click="confirmDeleteTransaction(row.id)"
              />
            </div>
          </template>
          <template #date-data="{ row }">
            <span>{{ formatDate(row.date) }}</span>
          </template>
        </UTable>

        <UButton
          type="button"
          class="nav-button"
          @click="printDiv('transaction-page')"
        >
          Print Transaction Data
        </UButton>
      </div>
      <ConfirmationModal
        :is-open="deleteModalActive"
        :content="deleteModalContent"
        @cancel="onDeleteModalCancel"
        @confirm="onDeleteModalConfirm"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
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
  recurrenceEndDate: '',
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
    !state.isRecurring ||
    (state.recurrenceType !== '' && state.recurrenceEndDate !== '')

  return (
    requiredFieldsFilled &&
    validCategorySelected &&
    (state.customCategory ? state.customCategoryName.trim() !== '' : true) &&
    validRecurrenceSelected
  )
})
const pageStyles = computed(() => {
  let gradientColor = 'rgba(90, 90, 90, 0.1)'
  const fallbackColor = 'rgba(28, 28, 28, 0.1)'
  if (transactions.totalBalance > 0) {
    gradientColor = 'rgba(39, 174, 96, 0.1)'
  } else if (transactions.totalBalance < 0) {
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
    const recurrenceEndDate = new Date(state.recurrenceEndDate + 'T00:00:00')
    const recurrenceType = state.recurrenceType
    const currentDate = new Date(transactionDate)

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
    if (success && state.customCategory) {
      if (!filteredCategories.value.includes(state.customCategoryName)) {
        catagories.categories.push(state.customCategoryName)
      }
    }
  }

  if (success) {
    resetState(state)
  } else {
    toast.add({
      title: 'Error',
      description: 'Failed to add transaction.',
    })
  }
}

function toggleRecurring() {
  if (!state.isRecurring) {
    state.recurrenceType = ''
    state.recurrenceEndDate = ''
  }
}
function editTransaction(id) {
  const transaction = transactions.getTransactionById(id)

  const confirmEdit = confirm(
    'Are you sure you want to edit transaction from ' +
      formatDate(transaction.date) +
      ' at ' +
      transaction.store +
      ' for $' +
      transaction.amount / 100.0 +
      ' in the ' +
      transaction.category +
      ' category?'
  )

  if (confirmEdit) {
    transactions.removeTransaction(id)
    state.store = transaction.store
    state.amount = transaction.amount / 100
    state.date = transaction.date.toISOString().split('T')[0]
    state.type = transaction.type
    state.category = transaction.category
    state.customCategory = transaction.customCategory
    state.customCategoryName = transaction.customCategoryName
    state.isRecurring = transaction.isRecurring
    state.recurrenceType = transaction.recurrenceType
    state.recurrenceEndDate = transaction.recurrenceEndDate
      .toISOString()
      .split('T')[0]
  }
}

function resetState(state) {
  state.store = ''
  state.amount = ''
  state.date = ''
  state.category = ''
  state.customCategory = false
  state.customCategoryName = ''
  state.isRecurring = false
  state.recurrenceType = ''
  state.recurrenceEndDate = ''
}

const searchQuery = ref('')

const deleteModalActive = ref(false)
const deleteModalContent = ref('')
const currentID = ref('')

const formatDate = (dateString) => {
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const getFormattedDateComponents = (dateString) => {
  const date = new Date(dateString)
  return {
    day: date.toLocaleDateString(undefined, { day: 'numeric' }).toLowerCase(),
    month: date.toLocaleDateString(undefined, { month: 'short' }).toLowerCase(),
    year: date.toLocaleDateString(undefined, { year: 'numeric' }).toLowerCase(),
    weekday: date
      .toLocaleDateString(undefined, { weekday: 'short' })
      .toLowerCase(),
  }
}

const filteredTransactions = computed(() => {
  const queryWords = searchQuery.value.toLowerCase().split(/\s+/)
  return transactions.transactions.filter((transaction) => {
    const formattedDateComponents = getFormattedDateComponents(transaction.date)
    return queryWords.every((word) =>
      [
        transaction.store.toLowerCase(),
        transaction.category.toLowerCase(),
        transaction.amount.toString(),
        transaction.type.toLowerCase(),
        formattedDateComponents.day,
        formattedDateComponents.month,
        formattedDateComponents.year,
        formattedDateComponents.weekday,
      ].some((field) => field.includes(word))
    )
  })
})

const columns = [
  {
    key: 'store',
    label: 'Store',
    class: 'italic',
    sortable: true,
  },
  {
    key: 'category',
    label: 'Category',
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
  {
    key: 'delete',
    label: '',
    sortable: false,
  },
]

const calculateFilteredTotalBalance = computed(() => {
  let total = 0

  for (const transaction of filteredTransactions.value) {
    if (transaction.type === TransactionType.EXPENSE)
      total -= Number(transaction.amount)
    else if (transaction.type === TransactionType.INCOME)
      total += Number(transaction.amount)
  }

  return total
})

function confirmDeleteTransaction(id) {
  const transaction = transactions.getTransactionById(id)

  currentID.value = id

  deleteModalContent.value =
    'Are you sure you want to delete transaction from ' +
    formatDate(transaction.date) +
    ' at ' +
    transaction.store +
    ' for $' +
    transaction.amount / 100.0 +
    ' in the ' +
    transaction.category +
    ' category?'

  deleteModalActive.value = true
}

function onDeleteModalCancel() {
  deleteModalActive.value = false
}

function onDeleteModalConfirm() {
  transactions.removeTransaction(currentID.value)
  deleteModalActive.value = false
}
</script>

<style scoped>
.page-container {
  display: flex;
}

.table-container {
  padding-top: 20px;
  flex: 1;
  margin-right: 20px;
}

.search-container {
  border-radius: 25px;
  box-shadow: 0px 0px 0px;
  width: 100%;
  padding-top: 10px;
  padding-right: 25px;
  height: 2.5rem;
  box-shadow: 0px 0px 0px;
  font-size: 16px;
  line-height: 125%;
  display: flex;
}

.search-container input {
  width: 100%;
  padding-left: 40px;
  left: -10px;
  border-radius: 15px;
}

.search-container:hover {
  border-radius: 25px;
}

.search-container .search-icon {
  position: relative;
  left: 25px;
  top: 5px;
  font-size: 18px;
  color: #555;
}

.page-container {
  display: flex;
  gap: 20px;
}

.form-container {
  flex: 1;
}

.history-container {
  flex: 1;
}
</style>
