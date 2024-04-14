<template>
  <div class="centered-container">
    <div class="home-container">
      <h1>Welcome to <span class="brand-text">Free My Financials</span></h1>
      <p>
        Free My Financials is a sophisticated web-based budgeting tool designed
        to shift your mindset from living paycheck-to-paycheck to a cashflow
        approach.
      </p>
      <a
        v-if="!auth.isLoggedIn"
        href="auth/login/github"
        class="get-started-button"
      >
        Get Started
      </a>
    </div>
    <div class="use-container">
      <h1>Current Contents</h1>
      <p>
        Explore the features of Free My Financials to manage your finances
        effectively:
      </p>
      <ul class="feature-list">
        <li class="feature-item">
          <h2 class="feature-title">Add and View Transactions</h2>
          <p class="feature-text">
            Visit the
            <NuxtLink to="/transaction/transactions" class="green-text-link">
              Transactions
            </NuxtLink>
            page. Input accurate information to enhance transaction tracking.
            View your transaction history and use the search bar for specific
            insights.
          </p>
        </li>
        <li class="feature-item">
          <h2 class="feature-title">Create and View Budgets</h2>
          <p class="feature-text">
            Visit the
            <NuxtLink to="/budget/budget" class="green-text-link">
              Budget
            </NuxtLink>
            page, covering dates and remaining balances. Easily track all
            transactions within your budget. Set multiple budgets based on your
            financial needs.
          </p>
        </li>
        <li class="feature-item">
          <h2 class="feature-title">Visualize Financial Data</h2>
          <p class="feature-text">
            Visit the
            <NuxtLink to="/calendar" class="green-text-link">
              Calendar
            </NuxtLink>
            page. Track spending habits and changes in monthly balances. Hover
            over the monthly balance in the top right to view the exact percent
            change in your monthly spending.
          </p>
        </li>
        <li class="feature-item">
          <h2 class="feature-title">Monitor Monthly Changes</h2>
          <p class="feature-text">
            Visit the
            <NuxtLink to="/specs" class="green-text-link"> Specs </NuxtLink>
            page. Visualize your spending through graphs, showcasing your
            monthly purchases in graph format, as well as key statistics on your
            budgeting progress.
          </p>
        </li>
        <li class="feature-item">
          <h2 class="feature-title">Financial Literacy</h2>
          <p class="feature-text">
            Visit the
            <NuxtLink to="/information" class="green-text-link">
              Information
            </NuxtLink>
            page. View some articles that may help educate you on budgeting and
            financial literacy. Features tips and tricks to help make budgeting
            less of a hassle, and more of an automated process.
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<style scoped>
.feature-list {
  list-style-type: none;
  padding: 20px;
  margin: 0;
  margin-top: 30px;
}

.feature-item {
  margin-bottom: 20px;
}

.feature-title {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #27ae60;
}

.feature-text {
  color: white;
}

.home-container,
.use-container {
  max-width: 800px;
  margin: auto;
  text-align: center;
  padding: 20px;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #eaeaea;
}

p {
  font-size: 1.2em;
  color: #d7d7d7;
  line-height: 1.6;
}

.brand-text {
  color: #1ca254;
}

.get-started-button {
  display: inline-block;
  padding: 10px 20px;
  font-size: 1.2em;
  background-color: #1ca254;
  color: white;
  border-radius: 25px;
  text-decoration: none;
  margin-top: 20px;
}

.get-started-button:hover {
  background-color: #148a3d;
}

.centered-container {
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.use-container {
  margin-bottom: 20px;
  border-radius: 10px;
  background: radial-gradient(
    circle at center bottom,
    rgba(39, 174, 96, 0.5),
    rgba(28, 28, 28, 0.1) 80%
  );
  color: white;
}

.feature-list {
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.feature-link {
  margin-left: 15px;
  font-weight: bold;
  color: #27ae60;
}

.green-text-link {
  color: #27ae60;
  text-decoration: none;
}

.green-text-link:hover {
  text-decoration: underline;
}
</style>
