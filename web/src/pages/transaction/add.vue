<script lang="ts" setup>

const store = ref("")
const amount = ref(0)
const date = ref(Date.now())

type transaction = {
  Key: number,
  Store: string,
  Amount: number,
  Transaction_Date: number
}

const transactions = useCookie(
  "transactions",
  {
    default: (): transaction[] => []
  }
)

async function submit() {
  // const result = await useFetch("/api/transaction/add", {
  //   method: "POST",
  //   query: { store, amount, date }
  // })
  // console.log(result)
  if (transactions.value && transactions.value !== null) {
    transactions.value?.push({
      Key: Math.random(),
      Store: store.value,
      Amount: amount.value,
      Transaction_Date: date.value,
    })
    transactions.value = [...transactions.value]
  }

}
</script>


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
<div>{{ transactions }}</div>
</template>

