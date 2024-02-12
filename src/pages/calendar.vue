<template>
  <div class="calendar-container">
    <div class="calendar-nav">
      <UButton type="button" @click="prevMonth"> &lt; </UButton>
      <h2>{{ currentMonthName }} {{ currentYear }}</h2>
      <span v-if="showMonthlyBalance" class="total-balance">
        Monthly Balance:
        <div class="balance-container">
          <span class="balance-label" />
          <DollarAmount :amount="monthlyBalance" />
          <i
            v-show="showArrow"
            class="arrow"
            :class="{
              'arrow-up': isPositiveChange,
              'arrow-down': !isPositiveChange,
            }"
            :title="arrowTooltipText"
          >
            {{ isPositiveChange ? '↑' : '↓' }}
          </i>
        </div>
      </span>
      <UButton type="button" @click="nextMonth"> &gt; </UButton>
    </div>
    <div class="calendar">
      <div class="weekdays">
        <span v-for="day in weekdays" :key="day">{{ day }}</span>
      </div>
      <div class="days">
        <div
          v-for="blankDay in firstDayOfMonth"
          :key="`blank-${blankDay}`"
          class="blank"
        />
        <div
          v-for="day in Array.from(
            { length: daysInMonth },
            (_, index) => index + 1
          )"
          :key="day"
          class="day"
          :class="{ 'budget-day': budget.dateIsInBudget(day) }"
        >
          {{ day }}
          <br />
          <span
            v-if="dailyBalances[day] !== undefined && dailyBalances[day] !== 0"
          >
            <DollarAmount :amount="dailyBalances[day]" />
          </span>
          <span v-else />
          <div
            v-if="isBudgetStart(day) || isBudgetEnd(day)"
            class="budget-dates"
          >
            <div v-if="isBudgetStart(day)">Start of Budget</div>
            <div v-if="isBudgetEnd(day)">End of Budget</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const budget = useBudgetStore()
const transactions = useTransactionStore()

const currentDate = new Date()
const currentYear = ref(currentDate.getFullYear())
const currentMonth = ref(currentDate.getMonth())
const currentMonthName = ref(
  new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate)
)
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const dailyBalances = ref({})
const daysInMonth = ref(
  new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
)
const firstDayOfMonth = ref(
  new Date(currentYear.value, currentMonth.value, 1).getDay()
)

const showArrow = ref(false)
const isPositiveChange = ref(false)

function isBudgetStart(day) {
  const startDate = budget.startDate.getDate()
  const startMonth = budget.startDate.getMonth()
  return day === startDate && currentMonth.value === startMonth
}

function isBudgetEnd(day) {
  const endDate = budget.endDate.getDate()
  const endMonth = budget.endDate.getMonth()
  return day === endDate && currentMonth.value === endMonth
}

const arrowTooltipText = computed(() => {
  const currentMonthKey = `${currentYear.value}-${currentMonth.value}`
  const previousMonthYear =
    currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value
  const previousMonthKey = `${previousMonthYear}-${currentMonth.value === 0 ? 11 : currentMonth.value - 1}`

  const currentBalance = monthlyBalances.value[currentMonthKey] || 0
  const previousBalance = monthlyBalances.value[previousMonthKey] || 0
  const percentDifference =
    ((currentBalance - previousBalance) / Math.abs(previousBalance)) * 100

  const changeDirection = percentDifference > 0 ? 'increased' : 'decreased'

  const previousMonthName = new Intl.DateTimeFormat('en-US', {
    month: 'long',
  }).format(
    new Date(
      previousMonthYear,
      currentMonth.value === 0 ? 11 : currentMonth.value - 1,
      1
    )
  )

  return `Your monthly balance ${changeDirection} by ${Math.abs(percentDifference).toFixed(2)}% this month compared to ${previousMonthName}.`
})

const monthlyBalances = computed(() => {
  const balances = {}

  for (const transaction of transactions.transactions) {
    const transactionDate = new Date(transaction.date)
    const transactionMonth = transactionDate.getMonth()
    const transactionYear = transactionDate.getFullYear()

    const key = `${transactionYear}-${transactionMonth}`

    if (!balances[key]) {
      balances[key] = 0
    }

    if (transaction.type === TransactionType.EXPENSE) {
      balances[key] -= Number(transaction.amount)
    } else if (transaction.type === TransactionType.INCOME) {
      balances[key] += Number(transaction.amount)
    }
  }

  return balances
})

const monthlyBalance = computed(() => {
  const key = `${currentYear.value}-${currentMonth.value}`
  return monthlyBalances.value[key] || 0
})

onMounted(() => {
  updateCalendar()
})

function updateCalendar() {
  dailyBalances.value = {}

  daysInMonth.value = new Date(
    currentYear.value,
    currentMonth.value + 1,
    0
  ).getDate()
  firstDayOfMonth.value = new Date(
    currentYear.value,
    currentMonth.value,
    1
  ).getDay()
  currentMonthName.value = new Intl.DateTimeFormat('en-US', {
    month: 'long',
  }).format(new Date(currentYear.value, currentMonth.value, 1))

  const startDate = new Date(currentYear.value, currentMonth.value, 1)
  const endDate = new Date(currentYear.value, currentMonth.value + 1, 0)
  const dayBalances = {}

  transactions.transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date)
    if (transactionDate >= startDate && transactionDate <= endDate) {
      const day = transactionDate.getDate()
      dayBalances[day] =
        (dayBalances[day] || 0) +
        (transaction.type === TransactionType.EXPENSE ? -1 : 1) *
          Number(transaction.amount)
    }
  })

  dailyBalances.value = dayBalances

  const previousMonthYear =
    currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value
  const previousMonthKey = `${previousMonthYear}-${currentMonth.value === 0 ? 11 : currentMonth.value - 1}`
  showArrow.value = Object.prototype.hasOwnProperty.call(
    monthlyBalances.value,
    previousMonthKey
  )

  if (showArrow.value) {
    const currentMonthKey = `${currentYear.value}-${currentMonth.value}`
    isPositiveChange.value =
      monthlyBalances.value[currentMonthKey] >
      monthlyBalances.value[previousMonthKey]
  }
}

const showMonthlyBalance = computed(() => {
  const currentMonthKey = `${currentYear.value}-${currentMonth.value}`
  return (
    Object.prototype.hasOwnProperty.call(
      monthlyBalances.value,
      currentMonthKey
    ) && monthlyBalances.value[currentMonthKey] !== 0
  )
})

watch([currentMonth, currentYear], () => {
  updateCalendar()
})

watch(currentMonth, () => {
  updateCalendar()
})

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
}
</script>

<style scoped>
.total-balance {
  display: flex;
  align-items: center;
}

.balance-container {
  display: flex;
  align-items: center;
  margin-left: 5px;
}

.arrow {
  margin-left: 5px;
  font-size: 1.5em;
}

.arrow-up {
  color: green;
}

.arrow-down {
  color: red;
}

.calendar-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 96vh;
  justify-content: center;
}

h2 {
  margin-bottom: 10px;
  margin-top: 10px;
  font-size: 1.5em;
  color: #ffffff;
}

.calendar-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  background-color: #053505;
  margin-top: 10px;
  color: #f0f8ff;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.calendar {
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
  flex-grow: 1;
  width: 90%;
  background-color: #f0f8ff;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.weekdays {
  display: flex;
  background-color: #f7f7f7;
  border-bottom: 1px solid #ddd;
}

.weekdays span {
  flex: 1;
  padding: 15px;
  text-align: center;
  font-weight: bold;
  color: #006400;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 2fr);
}

.day {
  padding: 15px 15px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  color: #006400;
  height: 100px;
}

.budget-day,
.budget-period {
  background-color: rgba(144, 238, 144, 0.2);
}

.blank {
  flex: 1;
}
</style>
