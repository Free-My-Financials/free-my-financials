<template>
<header
  class="flex flex-row gap-20 p-2 pl-8 bg-primary-300 dark:bg-primary-500 text-gray-800 dark:text-white font-semibold">
  <h1 class="font-bold dark:hover:text-gray-800 hover:text-white">
    <NuxtLink to="/">Free My Financials</NuxtLink>
  </h1>
  <p class="dark:hover:text-gray-800 hover:text-white">
    <NuxtLink to="/transaction/add">Add Transaction</NuxtLink>
  </p>
  <p class="dark:hover:text-gray-800 hover:text-white">
    <NuxtLink to="/transaction/history">View Transactions</NuxtLink>
  </p>
</header>
</template>

