<template>
  <div class="page-container">
    <div class="header">
      <div class="nav-buttons">
        <UButton type="button" @click="prevMonth" class="nav-button">
          &lt;
        </UButton>
      </div>
      <div class="month-heading">
        <h2>{{ currentMonthName }} {{ currentYear }}</h2>
      </div>
      <div class="nav-buttons">
        <UButton type="button" @click="nextMonth" class="nav-button">
          &gt;
        </UButton>
      </div>
    </div>

    <div class="content-container">
      <div class="left-container">
        <div class="charts-container">
          <canvas ref="pieChartCanvas"></canvas>
        </div>
      </div>

      <div class="right-container">
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
import { onMounted, ref, computed, watch } from 'vue'
import Chart from 'chart.js/auto'
import { useTransactionStore } from '~/stores/transaction'

const transactions = useTransactionStore()
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())
const currentMonthName = ref(
  new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    new Date(currentYear.value, currentMonth.value, 1)
  )
)
const pieChartCanvas = ref(null)
let chartInstance = null

onMounted(() => {
  renderPieChart()
})

function renderPieChart() {
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
  renderPieChart()
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
  updateMonthName()
  renderPieChart()
}

function updateMonthName() {
  currentMonthName.value = new Intl.DateTimeFormat('en-US', {
    month: 'long',
  }).format(new Date(currentYear.value, currentMonth.value, 1))
}

onMounted(() => {
  updateMonthName()
})
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #053505;
  color: #f0f8ff;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-buttons {
  display: flex;
  align-items: center;
}

.month-heading {
  flex-grow: 1;
  text-align: center;
}

.nav-button {
  background-color: #006400;
  color: #f0f8ff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.content-container {
  display: flex;
}

.left-container {
  flex: 1;
  padding-right: 10px;
}

.right-container {
  flex: 1;
  padding-left: 10px;
}

.charts-container {
  padding: 10px;
}

.table-container,
.search-container {
}
</style>
