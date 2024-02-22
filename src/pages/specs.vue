<template>
  <div class="charts-container">
    <FinancialPieChart :transactions="transactions" />
    <canvas ref="barChart" @click="handleBarClick"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '~/stores/transaction'

const transactions = useTransactionStore()

const pieChart = ref(null)
const barChart = ref(null)
const router = useRouter()

onMounted(() => {
  if (pieChart.value) {
    const ctx = pieChart.value.getContext('2d')

    const categories = {}
    transactions.transactions.forEach((transaction) => {
      if (transaction.category) {
        categories[transaction.category] =
          (categories[transaction.category] || 0) + transaction.amount
      }
    })

    const categoryLabels = Object.keys(categories)
    const categoryAmounts = Object.values(categories)

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categoryLabels,
        datasets: [
          {
            data: categoryAmounts,
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
})

function handleBarClick(event) {
  const barChartInstance = barChart.value
  const activeElements = barChartInstance.getElementsAtEvent(event)

  if (activeElements.length > 0) {
    const selectedIndex = activeElements[0].index
    const labels = barChartInstance.data.labels
    const selectedMonth = labels[selectedIndex]
    router.push({ name: 'calendar', params: { month: selectedMonth } })
  }
}
</script>

<style scoped>
.charts-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
