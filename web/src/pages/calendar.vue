<template>
<div class="calendar-container">
  <div class="calendar-nav">
    <button @click="prevMonth">&lt;</button>
    <h2>{{ currentMonthName }} {{ currentYear }}</h2>
    <button @click="nextMonth">&gt;</button>
  </div>
  <div class="calendar">
    <div class="weekdays">
      <span v-for="day in weekdays" :key="day">{{ day }}</span>
    </div>
    <div class="days">
      <div v-for="blankDay in firstDayOfMonth" :key="`blank-${blankDay}`" class="blank"></div>
      <div v-for="day in daysInMonth" :key="day" class="day">
        {{ day }}
        <!-- Add your date-related information here -->
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.calendar-container {
  text-align: center;
}

h2 {
  margin-bottom: 10px;
  font-size: 1.5em;
}

.calendar {
  display: inline-block;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.weekdays {
  display: flex;
  background-color: #f7f7f7;
  border-bottom: 1px solid #ddd;
}

.weekdays span {
  flex: 1;
  padding: 10px;
  text-align: center;
  font-weight: bold;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.blank {
  flex: 1;
}
</style>
<script setup>
import { ref, watch } from 'vue';

const currentDate = new Date();
const currentYear = ref(currentDate.getFullYear());
const currentMonth = ref(currentDate.getMonth());
const currentMonthName = ref(new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate));
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let daysInMonth = ref(new Date(currentYear.value, currentMonth.value + 1, 0).getDate());
let firstDayOfMonth = ref(new Date(currentYear.value, currentMonth.value, 1).getDay());

function updateCalendar() {
  daysInMonth.value = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  firstDayOfMonth.value = new Date(currentYear.value, currentMonth.value, 1).getDay();
  currentMonthName.value = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    new Date(currentYear.value, currentMonth.value, 1)
  );
}

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

