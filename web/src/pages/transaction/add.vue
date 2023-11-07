<script lang="ts" setup>


const store = ref("")
const amount = ref(0)
const date = ref(Date.now())
const transactionType = ref('expense');

type transaction = {
  Key: number,
  Store: string,
  Amount: number,
  Transaction_Date: number | string;
  Type: string;
}

const transactions = useCookie(
  "transactions",
  {
    default: (): transaction[] => []
  }
)
const message = ref('');

async function submit() {
  // const result = await useFetch("/api/transaction/add", {
  //   method: "POST",
  //   query: { store, amount, date }
  // })
  // console.log(result)

  if (store.value && amount.value && date.value) {
    transactions.value.push({
      Key: Math.random(),
      Store: store.value,
      Amount: amount.value,
      Transaction_Date: date.value,
      Type: transactionType.value,
    });
    transactions.value = [...transactions.value];
    message.value = 'Transaction added successfully!';
    store.value = '';
    amount.value = 0;
  } else {
    message.value = 'Please fill in all the fields.';
  }

  setTimeout(() => {
    message.value = '';
  }, 2000);
}
</script>

<style lang="scss">
@import "add.scss";
</style>

<template>
<h1>
  Add Transaction
</h1>
<NuxtLink to="/">home</NuxtLink>
<form @submit.prevent="submit">
  <input type="text" name="Store" id="store" v-model="store"
    :placeholder="transactionType === 'income' ? 'Source of Income' : 'Place of Purchase'" />
  <input type="number" name="Amount" id="amount" v-model="amount"
    :placeholder="transactionType === 'income' ? 'Amount Gained' : 'Amount Spent'" />
  <input type="date" name="Date" id="date" v-model="date" />
  <select v-model="transactionType">
    <option value="expense">Expense</option>
    <option value="income">Income</option>
  </select>
  <input type="submit" value="Submit" />
</form>
<p>{{ message }}</p>
</template>
