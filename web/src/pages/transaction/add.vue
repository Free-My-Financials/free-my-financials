<script lang="ts" setup>
const toast = useToast()
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

async function submit() {
  if (store.value && amount.value && date.value) {
    transactions.value.push({
      Key: Math.random(),
      Store: store.value,
      Amount: amount.value,
      Transaction_Date: date.value,
      Type: transactionType.value,
    });
    transactions.value = [...transactions.value];
    store.value = '';
    amount.value = 0;
    toast.add({
      title: 'Success',
      description: 'Transaction added successfully!',
    });
  } else {
    toast.add({
      title: 'Invalid Input',
      description: 'Please fill in all the fields.',
    });
  }
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
</template>
