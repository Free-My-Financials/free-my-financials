<script lang="ts" setup>
const toast = useToast()

type transaction = {
  Key: number,
  Store: string,
  Amount: number,
  Transaction_Date: number | string;
  Type: string;
}

const state = reactive({
  store: "",
  amount: 0,
  date: Date.now(),
  type: "expense"
})

const transactionTypes = ['expense', 'income']

const transactions = useCookie(
  "transactions",
  {
    default: (): transaction[] => []
  }
)

async function submit() {
  if (state.store && state.amount && state.date) {
    transactions.value.push({
      Key: Math.random(),
      Store: state.store,
      Amount: state.amount,
      Transaction_Date: state.date,
      Type: state.type,
    });
    transactions.value = [...transactions.value];
    state.store = '';
    state.amount = 0;
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
//@import "add.scss";
</style>

<template>
<h1>
  Add Transaction
</h1>
<NuxtLink to="/">home</NuxtLink>
<UFormGroup label="Type of Transaction">
  <USelect :options="transactionTypes" v-model="state.type" />
</UFormGroup>

<UForm :state="state" @submit="submit">
  <UFormGroup :label="state.type === 'income' ? 'Source of Income' : 'Place of Purchase'">
    <UInput type="text" name="Store" id="store" v-model="state.store"
      :placeholder="state.type === 'income' ? 'Source of Income' : 'Place of Purchase'" />
  </UFormGroup>

  <UFormGroup label="Amount in cents">
    <UInput type="number" name="Amount" id="amount" v-model="state.amount"
      :placeholder="state.type === 'income' ? 'Amount Gained' : 'Amount Spent'" />
  </UFormGroup>

  <UFormGroup label="Date">
    <UInput type="date" name="Date" id="date" v-model="state.date" />
  </UFormGroup>


  <UButton type="submit">Submit</UButton>
</UForm>
</template>
