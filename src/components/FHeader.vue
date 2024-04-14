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
      <NuxtLink to="/transaction/transactions"> Transactions </NuxtLink>
    </p>
    <p
      v-if="auth.isLoggedIn"
      :class="[
        { 'text-white dark:text-gray-800': route.name === 'budget-budget' },
        'hover:text-white',
        'dark:hover:text-gray-800',
      ]"
    >
      <NuxtLink to="/budget/budget"> Budget </NuxtLink>
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
      <NuxtLink to="/specs"> Graphs </NuxtLink>
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
    <template v-if="auth.isLoggedIn">
      <h3>
        Budget:
        <UDropdown
          :items="budgetOptions"
          :popper="{ placement: 'bottom-start' }"
        >
          <UButton
            color="white"
            :label="budget.budget.name"
            trailing-icon="i-heroicons-chevron-down-20-solid"
          />
        </UDropdown>
      </h3>
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
        <a href="/auth/login/github"> Login </a>
      </p>
    </template>
  </header>
</template>

<script lang="ts" setup>
const route = useRoute()
const auth = useAuthStore()
const budget = useBudgetStore()
const budgetOptions = await budget.createBudgetSelection()

onMounted(() => {
  budget.fetchBudget()
})
</script>
