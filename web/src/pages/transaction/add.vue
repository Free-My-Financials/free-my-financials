<script lang="ts" setup>
const toast = useToast()
const store = ref("")
const amount = ref(0)
const date = ref(Date.now())

type transaction = {
  Key: number,
  Store: string,
  Amount: number,
  Transaction_Date: number | string;
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


<template>
<h1>
  Add Transaction
</h1>
<NuxtLink to="/">home</NuxtLink>
<form @submit.prevent="submit">
  <input type="text" name="Store" id="store" v-model="store" placeholder="Store" />
  <input type="number" name="Amount" id="amount" v-model="amount" placeholder="Total" />
  <input type="date" name="Date" id="date" v-model="date" />
  <input type="submit" value="submit" />
</form>
</template>
