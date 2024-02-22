<template>
  <div class="page-container">
    <div class="charts-container">
      <canvas ref="pieChartCanvas"></canvas>
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
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import Chart from 'chart.js/auto'
import { useTransactionStore } from '~/stores/transaction'

const transactions = useTransactionStore()
const deleteModalActive = ref(false)
const deleteModalContent = ref('')
const currentID = ref('')

const pieChartCanvas = ref(null)

onMounted(() => {
  renderPieChart()
})

function renderPieChart() {
  if (pieChartCanvas.value) {
    const ctx = pieChartCanvas.value.getContext('2d')

    const categories = {}
    let totalAmount = 0

    transactions.transactions.forEach((transaction) => {
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

    new Chart(ctx, {
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
</script>

<style scoped>
.page-container {
  display: flex;
}

.charts-container {
  flex: 1;
}

.table-container {
  flex: 1;
  margin-right: 20px;
}

.search-container {
  border-radius: 25px;
  box-shadow: 0px 0px 0px;
  width: 100%;
  padding-top: 10px;
  padding-left: 20px;
  height: 2.5rem;
  box-shadow: 0px 0px 0px;
  width: 35%;
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
</style>
