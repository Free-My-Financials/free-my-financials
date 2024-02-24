<template>
  <div class="page-container">
    <div class="header">
      <div class="nav-buttons">
        <UButton type="button" @click="prevMonth" class="nav-button">
          &lt; Previous Month
        </UButton>
      </div>
      <h2 class="month-heading">{{ currentMonthName }} {{ currentYear }}</h2>
      <div class="nav-buttons">
        <UButton type="button" @click="nextMonth" class="nav-button">
          Next Month &gt;
        </UButton>
      </div>
    </div>

    <div class="content-container">
      <div class="left-container">
        <div class="charts-container">
          <canvas ref="pieChartCanvas"></canvas>
          <div v-if="showQuote" class="quote-container">
            <p>No transactions found for the month of {{ currentMonthName }}</p>
          </div>
        </div>
      </div>

      <div class="right-container">
        <div class="budget-container">
          <p class="budget-summary">
            You have {{ remainingMonths }} months and {{ remainingDays }} days
            left of your budget. You've spent
            <DollarAmount
              :amount="Math.abs(budget.totalBalance - budget.amount)"
            />
            of your <DollarAmount :amount="budget.amount" /> budget, leaving you
            with <DollarAmount :amount="budget.totalBalance" /> left to spend.
          </p>
          <div class="button-container">
            <NuxtLink to="/budget/budget" class="green-button">
              Budget Transactions
            </NuxtLink>
          </div>
        </div>

        <div class="table-container"></div>
        <div class="search-container"></div>
        <ConfirmationModal
          :is-open="deleteModalActive"
          :content="deleteModalContent"
          @cancel="onDeleteModalCancel"
          @confirm="onDeleteModalConfirm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import Chart from 'chart.js/auto'
import { useTransactionStore } from '~/stores/transaction'
import { useBudgetStore } from '~/stores/budget'

const transactions = useTransactionStore()
const budget = useBudgetStore()
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())
const currentMonthName = ref(
  new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    new Date(currentYear.value, currentMonth.value, 1)
  )
)
const pieChartCanvas = ref(null)
let chartInstance = null
let showQuote = ref(false)

onMounted(() => {
  renderChart()
})

function renderChart() {
  if (pieChartCanvas.value) {
    const ctx = pieChartCanvas.value.getContext('2d')
    const categories = {}
    let totalAmount = 0
    const filteredTransactions = transactions.transactions.filter(
      (transaction) => {
        const transactionDate = new Date(transaction.date)
        return (
          transactionDate.getMonth() === currentMonth.value &&
          transactionDate.getFullYear() === currentYear.value
        )
      }
    )

    if (filteredTransactions.length === 0) {
      showQuote.value = true
      if (chartInstance) {
        chartInstance.destroy()
      }
      return
    } else {
      showQuote.value = false
    }

    filteredTransactions.forEach((transaction) => {
      if (transaction.category) {
        categories[transaction.category] =
          (categories[transaction.category] || 0) + transaction.amount
        totalAmount += transaction.amount
      }
    })
    const categoryLabels = Object.keys(categories)
    const categoryAmounts = Object.values(categories)
    const percentages = categoryAmounts.map(
      (amount) => (amount / totalAmount) * 100
    )

    if (chartInstance) {
      chartInstance.destroy()
    }

    chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categoryLabels,
        datasets: [
          {
            data: percentages,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    })
  }
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
  updateMonthName()
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
  updateMonthName()
}

function updateMonthName() {
  currentMonthName.value = new Intl.DateTimeFormat('en-US', {
    month: 'long',
  }).format(new Date(currentYear.value, currentMonth.value, 1))
  renderChart()
}

const totalSpent = computed(() => {
  return budget.transactions.reduce((total, transaction) => {
    return total + (transaction.type === 'EXPENSE' ? transaction.amount : 0)
  }, 0)
})

const budgetAmountSpent = computed(() => {
  return budget.transactions.reduce((total, transaction) => {
    return total + (transaction.type === 'EXPENSE' ? transaction.amount : 0)
  }, 0)
})

const remaining = computed(() => {
  return budget.amount - totalSpent.value
})

const remainingMonths = computed(() => {
  const currentDate = new Date()
  const endDate = new Date(budget.endDate)
  const diffMonths =
    endDate.getMonth() -
    currentDate.getMonth() +
    12 * (endDate.getFullYear() - currentDate.getFullYear())
  return diffMonths
})

const remainingDays = computed(() => {
  const currentDate = new Date()
  const endDate = new Date(budget.endDate)
  const diffTime = endDate - currentDate
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
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
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  background-color: #053505;
  color: #f0f8ff;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.month-heading {
  font-size: 1.5rem;
}

.nav-button {
  background-color: #006400;
  color: #f0f8ff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 10px;
}

.content-container {
  display: flex;
}

.left-container {
  flex: 1;
}

.right-container {
  flex: 1;
  padding-left: 20px;
}

.budget-container {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
}

.budget-summary {
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
}

.green-button {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.green-button:hover {
  background-color: #45a049;
}
</style>
