<template>
  <div class="page-container">
    <div class="header">
      <div class="nav-buttons">
        <UButton type="button" class="nav-button" @click="prevMonth">
          &lt; Previous Month
        </UButton>
      </div>
      <h2 class="month-heading">{{ currentMonthName }} {{ currentYear }}</h2>
      <div class="nav-buttons">
        <UButton type="button" class="nav-button" @click="nextMonth">
          Next Month &gt;
        </UButton>
      </div>
    </div>
    <div class="content-container">
      <div class="left-container">
        <div class="charts-container">
          <canvas ref="pieChartCanvas"></canvas>
          <div v-if="showPieChartQuote" class="quote-container">
            <div class="quote-wrapper">
              <p>
                No transactions found for the month of {{ currentMonthName }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="right-container">
        <div v-if="!showLineChartQuote" class="charts-container">
          <canvas ref="lineChartCanvas" class="line-chart"></canvas>
        </div>
        <div v-if="showLineChartQuote" class="quote-container">
          <div class="quote-wrapper">
            <p>No transactions found for the month of {{ currentMonthName }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="bar-graph-container">
      <canvas ref="barGraphCanvas"></canvas>
    </div>
    <div v-if="remainingDays > 0" class="budget-container">
      <p class="budget-summary">
        Your budget has
        <template v-if="remainingWeeks > 0">
          {{ remainingWeeks }} week{{ remainingWeeks > 1 ? 's' : '' }}
          <template v-if="remainingDays > 0">
            and {{ remainingDays }} day{{ remainingDays > 1 ? 's' : '' }}
          </template>
        </template>
        <template v-else>
          {{ remainingDays }} day{{ remainingDays > 1 ? 's' : '' }}
        </template>
        left. You're
        <span :class="isOnTrack ? 'on-track' : 'off-track'">
          {{ isOnTrack ? 'on track' : 'not on track' }}
        </span>
        to keep under your set budget of
        <DollarAmount :amount="budget.amount" />, with
        <template v-if="budget.totalBalance > 0">
          <DollarAmount :amount="budget.totalBalance" />
          available.
        </template>
        <template v-else>
          <DollarAmount :amount="budget.totalBalance" />
          past allowed spending.
        </template>
        To see a more in-depth overview of transactions taking place within your
        budget, click the button below.
      </p>
      <div class="button-container">
        <NuxtLink to="/budget/budget" class="green-button">
          Budget Transactions
        </NuxtLink>
      </div>
    </div>
    <div v-else class="budget-container">
      <div class="quote-wrapper">
        <p class="budget-summary">
          No active budget, please set one on the following page.
        </p>
      </div>
      <div class="button-container">
        <NuxtLink to="/budget/budget" class="green-button">
          Add Budget
        </NuxtLink>
      </div>
    </div>
    <div v-if="showRelevantLinks" class="relevant-links-container">
      <p>Here are some articles that might be relevant to you :</p>
      <ul>
        <li v-if="showUnnecessarySpendingLink">
          <a
            href="https://www.unbiased.co.uk/discover/personal-finance/budgeting/mindful-spending-how-to-stop-spending-money-on-unnecessary-things"
            class="relevant-link"
            >Mindful Spending</a
          >
          <a
            href="https://merrickbank.com/Learn/Budgeting/5-Ways-to-Avoid-Unnecessary-Spending"
            class="relevant-link"
            >Ways to Avoid Unnecessary Spending</a
          >
        </li>
        <li v-if="showBudgetingHelpLink">
          <a
            href="https://www.unfcu.org/financial-wellness/50-30-20-rule/#:~:text=The%2050-30-20%20rule%20recommends%20putting%2050%25%20of,closer%20look%20at%20each%20category."
            class="relevant-link"
            >Budgeting Basics: The 50-30-20 Rule</a
          >
          <a
            href="https://www.discover.com/personal-loans/resources/consolidate-debt/good-financial-habits/"
            class="relevant-link"
            >Good Money Habits</a
          >
          <a
            href="https://bettermoneyhabits.bankofamerica.com/en/saving-budgeting/ways-to-save-money"
            class="relevant-link"
            >Simple Ways to Save</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import Chart from 'chart.js/auto'

const showRelevantLinks = computed(() => {
  return showUnnecessarySpendingLink.value || showBudgetingHelpLink.value
})

const showBudgetingHelpLink = ref(false)
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
const lineChartCanvas = ref(null)
const barGraphCanvas = ref(null)
let pieChartInstance = null
let lineChartInstance = null
let barGraphInstance = null
const showPieChartQuote = ref(false)
const showLineChartQuote = ref(false)

onMounted(() => {
  renderCharts()
  budget.fetchBudget()
})

function renderCharts() {
  renderPieChart()
  renderLineChart()
  renderBarGraph()
}

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

    if (filteredTransactions.length === 0) {
      showPieChartQuote.value = true
      if (pieChartInstance) {
        pieChartInstance.destroy()
      }
      return
    } else {
      showPieChartQuote.value = false
    }

    filteredTransactions.forEach((transaction) => {
      if (transaction.category) {
        categories[transaction.category] =
          (categories[transaction.category] || 0) + transaction.amount / 100
        totalAmount += transaction.amount / 100
      }
    })
    const categoryLabels = Object.keys(categories)
    const categoryAmounts = Object.values(categories)
    const percentages = categoryAmounts.map(
      (amount) => (amount / totalAmount) * 100
    )

    if (pieChartInstance) {
      pieChartInstance.destroy()
    }

    pieChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categoryLabels,
        datasets: [
          {
            data: percentages,
            backgroundColor: [
              'rgba(144, 238, 144, 0.6)',
              'rgba(50, 205, 50, 0.6)',
              'rgba(0, 128, 0, 0.6)',
              'rgba(0, 100, 0, 0.6)',
              'rgba(34, 139, 34, 0.6)',
              'rgba(0, 255, 0, 0.6)',
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

function renderLineChart() {
  if (lineChartCanvas.value) {
    const ctx = lineChartCanvas.value.getContext('2d')
    const dailyTransactions = getDailyTransactions()

    if (Object.keys(dailyTransactions).length === 0) {
      showLineChartQuote.value = true
      if (lineChartInstance) {
        lineChartInstance.destroy()
      }
      return
    } else {
      showLineChartQuote.value = false
    }

    const days = Object.keys(dailyTransactions)
    const amounts = Object.values(dailyTransactions)
    let lineColor = 'green'

    if (Math.min(...amounts) < 0) {
      lineColor = 'red'
    }

    if (lineChartInstance) {
      lineChartInstance.destroy()
    }

    lineChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: days,
        datasets: [
          {
            data: amounts,
            borderColor: lineColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    })
  }
}

function renderBarGraph() {
  if (barGraphCanvas.value) {
    const ctx = barGraphCanvas.value.getContext('2d')
    const monthlyTransactions = getMonthlyTransactions()
    const months = Object.keys(monthlyTransactions)
    const totalTransactions = Object.values(monthlyTransactions)

    const monthlyIncome = getMonthlyIncome()

    if (barGraphInstance) {
      barGraphInstance.destroy()
    }

    barGraphInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Total Income',
            data: monthlyIncome,
            backgroundColor: 'rgba(144, 238, 144, 0.6)',
          },
          {
            label: 'Total Expense',
            data: totalTransactions,
            backgroundColor: 'rgba(255, 0, 0, 0.6)',
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
          },
        },
      },
    })
  }
}

function getMonthlyIncome() {
  const monthlyIncome = {}

  for (let i = 0; i < 12; i++) {
    const monthYear = `${i + 1}/${currentYear.value}`
    monthlyIncome[monthYear] = 0
  }

  transactions.transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date)
    const monthYear = `${transactionDate.getMonth() + 1}/${transactionDate.getFullYear()}`

    if (
      transaction.type === TransactionType.INCOME &&
      transactionDate.getFullYear() === currentYear.value
    ) {
      monthlyIncome[monthYear] += transaction.amount / 100
    }
  })

  return Object.values(monthlyIncome)
}

function getDailyTransactions() {
  const dailyTransactions = {}
  let balance = 0

  transactions.transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date)
    if (
      transactionDate.getMonth() === currentMonth.value &&
      transactionDate.getFullYear() === currentYear.value
    ) {
      const day = transactionDate.getDate()

      if (transaction.type === TransactionType.EXPENSE) {
        balance -= transaction.amount / 100
      } else {
        balance += transaction.amount / 100
      }

      dailyTransactions[day] = balance
    }
  })

  const daysInMonth = new Date(
    currentYear.value,
    currentMonth.value + 1,
    0
  ).getDate()
  for (let i = 1; i <= daysInMonth; i++) {
    if (!(i in dailyTransactions)) {
      dailyTransactions[i] = dailyTransactions[i - 1] || 0
    }
  }

  return dailyTransactions
}

function getMonthlyTransactions() {
  const monthlyTransactions = {}

  for (let i = 0; i < 12; i++) {
    const monthYear = `${i + 1}/${currentYear.value}`
    monthlyTransactions[monthYear] = 0
  }

  transactions.transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date)
    const monthYear = `${transactionDate.getMonth() + 1}/${transactionDate.getFullYear()}`

    if (
      transaction.type === TransactionType.EXPENSE &&
      transactionDate.getFullYear() === currentYear.value
    ) {
      monthlyTransactions[monthYear] += transaction.amount / 100
    }
  })

  return monthlyTransactions
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
  renderCharts()
}

const remainingWeeks = computed(() => {
  const remainingDays = budget.endDate - Date.now()
  return Math.floor(remainingDays / (1000 * 60 * 60 * 24 * 7))
})

const remainingDays = computed(() => {
  const remainingDays = budget.endDate - Date.now()
  return Math.ceil(remainingDays / (1000 * 60 * 60 * 24)) % 7
})

const isOnTrack = budget.totalBalance >= 0

const showUnnecessarySpendingLink = computed(() => {
  const entertainmentTransactions = transactions.transactions.filter(
    (transaction) =>
      transaction.category === 'Entertainment' &&
      new Date(transaction.date).getMonth() === currentMonth.value &&
      new Date(transaction.date).getFullYear() === currentYear.value
  )
  return entertainmentTransactions.length > 4
})

if (!isOnTrack) {
  showBudgetingHelpLink.value = true
}
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

.left-container,
.right-container {
  flex: 1;
}

.line-chart {
  border-color: green;
}

.charts-container {
  width: 100%;
  position: relative;
  min-height: 400px;
  padding-bottom: 20px;
}
.relevant-links-container {
  padding: 20px;
  border: 1px solid #146d36;
  border-radius: 5px;
  margin-bottom: 20px;
}

.relevant-links-container p {
  font-weight: bold;
  margin-bottom: 10px;
}

.relevant-links-container ul {
  list-style-type: none;
  padding: 0;
}

.relevant-links-container li {
  margin-bottom: 5px;
}

.relevant-link {
  text-decoration: none;
  color: #006400;
  font-weight: bold;
  display: block;
}

.relevant-link:hover {
  text-decoration: underline;
}

.bar-graph-container {
  width: 100%;
  min-height: 400px;
  padding-bottom: 20px;
}

.quote-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
}

.quote-wrapper {
  display: inline-block;
  vertical-align: middle;
}

.budget-container {
  padding: 20px;
  border: 1px solid #146d36;
  border-radius: 5px;
  margin-bottom: 20px;
  padding-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  min-height: 100px;
  margin-top: 10px;
}

.budget-summary {
  justify-content: center;
}

.on-track {
  color: green;
}

.off-track {
  color: red;
}

.button-container {
  display: flex;
  padding-top: 20px;
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
