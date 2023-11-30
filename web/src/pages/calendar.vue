<template>
<div class="calendar-container">
  <div class="calendar-nav">
    <UButton @click="prevMonth" type="button">&lt;</UButton>
    <h2>{{ currentMonthName }} {{ currentYear }}</h2>
    <span class="total-balance">
      Total Balance:
      <div class="balance-container">
        <DollarAmount :amount="monthlyBalance" />
        <i v-show="showArrow" class="arrow"
          :class="{ 'arrow-up': isPositiveChange, 'arrow-down': !isPositiveChange }">{{ isPositiveChange ? '↑' : '↓'
          }}</i>
      </div>
    </span>
    <UButton @click="nextMonth" type="button">&gt;</UButton>
  </div>
  <div class="calendar">
    <div class="weekdays">
      <span v-for="day in weekdays" :key="day">{{ day }}</span>
    </div>
    <div class="days">
      <div v-for="blankDay in firstDayOfMonth" :key="`blank-${blankDay}`" class="blank"></div>
      <div v-for="day in Array.from({ length: daysInMonth }, (_, index) => index + 1)" :key="day" class="day">
        {{ day }}
        <br />
        <span v-if="dailyBalances[day] !== undefined && dailyBalances[day] !== 0">
          <DollarAmount :amount="dailyBalances[day]" />
        </span>
        <span v-else>
          <!-- You can add a message or leave it empty for days with no transactions -->
        </span>
      </div>

    </div>
  </div>
</div>
</template>

<style scoped>
.total-balance {
  display: flex;
  align-items: center;
}

.balance-container {
  display: flex;
  align-items: center;
}

.arrow {
  margin-left: 5px;
  /* Adjust the margin to move the arrow further right */
  font-size: 1.5em;
  /* Adjust the font-size for a larger arrow */
}

.arrow-up {
  color: green;
  /* Set the color for the upward arrow */
}

.arrow-down {
  color: red;
  /* Set the color for the downward arrow */
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
  background-color: #006400;
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

.blank {
  flex: 1;
}
</style>


<script setup>

import { ref, watch, computed, onMounted } from 'vue';
import useTransactions, { TransactionType } from '~/composables/useTransactions';

const transactions = useTransactions();
const currentDate = new Date();
const currentYear = ref(currentDate.getFullYear());
const currentMonth = ref(currentDate.getMonth());
const currentMonthName = ref(new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate));
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let dailyBalances = ref({});
let daysInMonth = ref(new Date(currentYear.value, currentMonth.value + 1, 0).getDate());
let firstDayOfMonth = ref(new Date(currentYear.value, currentMonth.value, 1).getDay());

const showArrow = ref(false); // Use ref to make it reactive
const isPositiveChange = ref(false);

const monthlyBalances = computed(() => {
  const balances = {};

  for (const transaction of transactions.value) {
    const transactionDate = new Date(transaction.date);
    const transactionMonth = transactionDate.getMonth();
    const transactionYear = transactionDate.getFullYear();

    const key = `${transactionYear}-${transactionMonth}`;

    if (!balances[key]) {
      balances[key] = 0;
    }

    if (transaction.type === TransactionType.EXPENSE) {
      balances[key] -= Number(transaction.amount);
    } else if (transaction.type === TransactionType.INCOME) {
      balances[key] += Number(transaction.amount);
    }
  }

  return balances;
});

const monthlyBalance = computed(() => {
  const key = `${currentYear.value}-${currentMonth.value}`;
  return monthlyBalances.value[key] || 0;
});

onMounted(() => {
  updateCalendar();
});

function updateCalendar() {
  dailyBalances.value = {};

  if (!transactions.value) {
    console.error('Transactions are not available');
    return;
  }

  daysInMonth.value = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  firstDayOfMonth.value = new Date(currentYear.value, currentMonth.value, 1).getDay();
  currentMonthName.value = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    new Date(currentYear.value, currentMonth.value, 1)
  );

  const startDate = new Date(currentYear.value, currentMonth.value, 1);
  const endDate = new Date(currentYear.value, currentMonth.value + 1, 0);
  const dayBalances = {};

  transactions.value.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    if (transactionDate >= startDate && transactionDate <= endDate) {
      const day = transactionDate.getDate();
      dayBalances[day] = (dayBalances[day] || 0) + (transaction.type === TransactionType.EXPENSE ? -1 : 1) * Number(transaction.amount);
    }
  });

  dailyBalances.value = dayBalances;

  const previousMonthYear = currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value;
  const previousMonthKey = `${previousMonthYear}-${currentMonth.value === 0 ? 11 : currentMonth.value - 1}`;
  showArrow.value = monthlyBalances.value.hasOwnProperty(previousMonthKey);

  console.log('showArrow:', showArrow.value);

  if (showArrow.value) {
    const currentMonthKey = `${currentYear.value}-${currentMonth.value}`;
    console.log('Monthly Balances:', monthlyBalances.value);
    console.log('Current Month Balance:', monthlyBalances.value[currentMonthKey]);
    console.log('Previous Month Balance:', monthlyBalances.value[previousMonthKey]);

    isPositiveChange.value = monthlyBalances.value[currentMonthKey] > monthlyBalances.value[previousMonthKey];
    console.log('isPositiveChange:', isPositiveChange.value);
  }
}


watch([currentMonth, currentYear], () => {
  updateCalendar();
});

watch(currentMonth, () => {
  updateCalendar();
});

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
}
</script>

