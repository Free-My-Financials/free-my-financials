<template>
<UFormGroup label="Type of Transaction">
  <USelect :options="Object.values(TransactionType)" v-model="state.type" />
</UFormGroup>

<UForm :state="state" @submit="submit">
  <UFormGroup :label="state.type === TransactionType.INCOME ? 'Source of Income' : 'Place of Purchase'">
    <UInput type="text" name="Store" id="store" v-model="state.store"
      :placeholder="state.type === TransactionType.INCOME ? 'Source of Income' : 'Place of Purchase'" />
  </UFormGroup>

  <UFormGroup label="Category">
    <USelect :options="categories" v-model="state.category" />
  </UFormGroup>

  <UFormGroup label="Amount">
    <UInput type="number" step="0.01" min="0" name="Amount" id="amount" v-model="state.amount"
      :placeholder="state.type === TransactionType.INCOME ? 'Amount Gained' : 'Amount Spent'" />
  </UFormGroup>

  <UFormGroup label="Date">
    <UInput type="date" name="Date" id="date" v-model="state.date" />
  </UFormGroup>

  <UButton type="submit">Submit</UButton>
</UForm>
</template>

<script lang="ts" setup>
const transactions = useTransactions()
const categories = ['Groceries', 'Clothing', 'Entertainment', 'Other'];
const toast = useToast()

const state = reactive({
  store: "",
  amount: 0,
  date: '',
  type: TransactionType.EXPENSE,
  category: categories[0]
})

async function submit() {
  if (state.store && state.amount && state.date) {
    transactions.value.push({
      id: Math.random(),
      type: state.type,
      store: state.store,
      amount: Math.round(state.amount * 100),
      date: new Date(state.date),
    })
    resetState()
    toast.add({
      title: 'Success',
      description: 'Transaction added successfully!',
    })
  } else {
    toast.add({
      title: 'Invalid Input',
      description: 'Please fill in all the fields.',
    })
  }
}

function resetState() {
  state.store = ''
  state.amount = 0
  state.date = ''
  state.type = TransactionType.EXPENSE
  state.category = categories[0];
}
</script>
