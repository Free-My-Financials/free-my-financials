<template>
<h1>
  Add Transaction
</h1>
<form @submit.prevent="submit">
  <input type="text" name="Store" id="store" v-model="store" />
  <input type="number" name="Amount" id="amount" v-model="amount" />
  <input type="date" name="Date" id="date" v-model="date" />
  <input type="submit" value="submit" />
</form>
</template>

<script lang="ts" setup>
const store = ref("")
const amount = ref(0)
const date = ref(Date.now())

async function submit() {
  // const result = await useFetch("/api/transaction/add", {
  //   method: "POST",
  //   query: { store, amount, date }
  // })
  // console.log(result)

  const transactions = useCookie("transactions")
  transactions.value = transactions.value ?? "[]"
}
</script>
