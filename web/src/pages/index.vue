<template>
<div class="home-container">
  <h1>Welcome to <span class="brand-text">Free My Financials</span></h1>
  <p>
    Free My Financials is a sophisticated web-based budgeting tool designed to shift your mindset from living
    paycheck-to-paycheck
    to a cashflow approach.
  </p>
</div>
<div class="use-container">
  <h1>Current Contents</h1>
  <p>
    Explore the features of Free My Financials to manage your finances effectively:
  </p>
  <ul class="feature-list">
    <li>
      To add transactions, visit the "<span class="green-text-link">
        <NuxtLink to="/transaction/add">Add Transaction</NuxtLink>
      </span>"
      page. Input accurate information to enhance transaction tracking.
    </li>
    <li>
      Analyze your transactions and current balance on the "<span class="green-text-link">
        <NuxtLink to="/transaction/history">View Transactions</NuxtLink>
      </span>"
      page. Use the search bar for specific insights.
    </li>
    <li>
      Create a personalized budget on the "<span class="green-text-link">
        <NuxtLink to="/budget/editBudget">Edit Budget</NuxtLink>
      </span>"
      page. Tailor your budget to match your financial needs.
    </li>
    <li>
      Review your budgeting information on the "<span class="green-text-link">
        <NuxtLink to="/budget/budget">View Budget</NuxtLink>
      </span>"
      page, covering dates and remaining balances. Hover over the monthly balance in the top right to view the exact
      percent change in your monthly spending.
    </li>
    <li>
      Visualize your financial data on the "<span class="green-text-link">
        <NuxtLink to="/calendar">Calendar</NuxtLink>
      </span>" page. Track
      spending habits and changes in monthly balances. Hover over the monthly balance in the top right to view the exact
      percent change in your monthly spending.
    </li>
  </ul>
</div>
</template>

<style scoped>
.home-container {
  max-width: 800px;
  margin: auto;
  text-align: center;
  padding: 40px;
}

.use-container {
  max-width: 800px;
  margin: auto;
  text-align: justify;
  padding: 20px;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #333;
}

p {
  font-size: 1.2em;
  color: #555;
  line-height: 1.6;
}

.brand-text {
  color: #1ca254;
}

.feature-list {
  list-style-type: disc;
  /* Use 'disc' for bullet points */
  padding: 0;
  margin-left: 20px;
  /* Add left margin for better alignment */
}

.feature-list li {
  margin-bottom: 10px;
}

.green-text-link a {
  color: #27ae60;
  text-decoration: none;
}

.green-text-link a:hover {
  text-decoration: underline;
}
</style>
