<template>
  <header
    class="flex flex-row gap-20 p-2 pl-8 bg-primary-300 dark:bg-primary-500 text-gray-800 dark:text-white font-semibold"
  >
    <h1 class="font-bold dark:hover:text-gray-800 hover:text-white">
      <NuxtLink to="/"> Free My Financials </NuxtLink>
    </h1>
    <p
      v-if="auth.isLoggedIn"
      :class="[
        { 'text-white dark:text-gray-800': route.name === 'transaction-add' },
        'dark:hover:text-gray-800',
        'hover:text-white',
      ]"
    >
      <NuxtLink to="/transaction/add"> Add Transaction </NuxtLink>
    </p>
    <p
      v-if="auth.isLoggedIn"
      :class="[
        {
          'text-white dark:text-gray-800': route.name === 'transaction-history',
        },
        'hover:text-white',
        'dark:hover:text-gray-800',
      ]"
    >
      <NuxtLink to="/transaction/history"> View Transactions </NuxtLink>
    </p>
    <p
      v-if="auth.isLoggedIn"
      :class="[
        { 'text-white dark:text-gray-800': route.name === 'budget-editBudget' },
        'hover:text-white',
        'dark:hover:text-gray-800',
      ]"
    >
      <NuxtLink to="/budget/editBudget"> Edit Budget </NuxtLink>
    </p>
    <p
      v-if="auth.isLoggedIn"
      :class="[
        { 'text-white dark:text-gray-800': route.name === 'budget-budget' },
        'hover:text-white',
        'dark:hover:text-gray-800',
      ]"
    >
      <NuxtLink to="/budget/budget"> View Budget </NuxtLink>
    </p>
    <p
      v-if="auth.isLoggedIn"
      :class="[
        { 'text-white dark:text-gray-800': route.name === 'calendar' },
        'hover:text-white',
        'dark:hover:text-gray-800',
      ]"
    >
      <NuxtLink to="/calendar"> Calendar </NuxtLink>
    </p>
    <p
      v-if="auth.isLoggedIn"
      :class="[
        {
          'text-white dark:text-gray-800': route.name === 'specs',
        },
        'hover:text-white',
        'dark:hover:text-gray-800',
      ]"
    >
      <NuxtLink to="/specs"> Specs </NuxtLink>
    </p>

    <p
      v-if="auth.isLoggedIn"
      :class="[
        {
          'text-white dark:text-gray-800': route.name === 'information',
        },
        'hover:text-white',
        'dark:hover:text-gray-800',
      ]"
    >
      <NuxtLink to="/information"> Information </NuxtLink>
    </p>

    <div class="flex-grow" />

    <!-- Logout -->
    <p
      v-if="auth.isLoggedIn"
      :class="[
        { 'text-white dark:text-gray-800': route.name === 'logout' },
        'hover:text-white',
        'dark:hover:text-gray-800',
      ]"
    >
      <NuxtLink to="/" @click="auth.logout()"> Logout </NuxtLink>
    </p>

    <!-- Login -->
    <p
      v-if="!auth.isLoggedIn"
      :class="[
        { 'text-white dark:text-gray-800': route.name === 'login' },
        'hover:text-white',
        'dark:hover:text-gray-800',
      ]"
    >
      <NuxtLink to="/login"> Login </NuxtLink>
    </p>
  </header>
</template>

<script lang="ts" setup>
const route = useRoute()
const auth = useAuthStore()
</script>
