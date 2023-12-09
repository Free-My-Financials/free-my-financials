<template>
<UFormGroup label="Type of Transaction">
  <USelect :options="Object.values(TransactionType)" v-model="state.type" />
</UFormGroup>

<UForm :state="state" @submit="submit">
  <UFormGroup :label="state.type === TransactionType.INCOME ? 'Source of Income' : 'Place of Purchase'">
    <UInput type="text" name="Store" id="store" v-model="state.store"
      :placeholder="state.type === TransactionType.INCOME ? 'Source of Income' : 'Place of Purchase'" />
  </UFormGroup>

  <UFormGroup label="Category" v-if="state.type === TransactionType.EXPENSE">
    <USelect :options="catagories.categories" v-model="state.category" v-if="!state.customCategory"
      :placeholder="'Category of Purchase'" />
    <UInput v-if="state.customCategory" type="text" name="CustomCategory" id="customCategory"
      v-model="state.customCategoryName" :key="state.customCategory.toString()" :placeholder="'Category'" />
    <div style="display: flex; align-items: center; margin-top: 8px;">
      <UCheckbox v-model="state.customCategory" />
      <label style="margin-left: 8px;">Click to enter a custom category</label>
    </div>
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
const transactions = useTransactionStore()
const catagories = useCategoryStore()
const toast = useToast()


const state = reactive({
  store: "",
  amount: "",
  date: '',
  type: TransactionType.EXPENSE,
  category: "",
  customCategory: false,
  customCategoryName: '',
})

const canSubmit = computed(() => {
  const requiredFieldsFilled = state.store && state.amount !== "" && state.date;
  const validCategorySelected =
    state.type === TransactionType.EXPENSE ? (state.category !== null && state.category !== "") || state.customCategory : true;
  return requiredFieldsFilled && validCategorySelected && (state.customCategory ? state.customCategoryName.trim() !== "" : true);
});

async function submit() {
  if (!canSubmit.value) {
    toast.add({
      title: 'Invalid Input',
      description: 'Please fill in all the fields.',
    })

    return
  }

  const parsedAmount = parseFloat(state.amount);

  if (isNaN(parsedAmount))
    return

  transactions.addTransaction({
    id: Math.random(),
    type: state.type,
    store: state.store,
    amount: Math.round(parsedAmount * 100),
    date: new Date(state.date + 'T00:00:00'),
    category: state.customCategory ? state.customCategoryName : state.category,
  });

  if (state.customCategory)
    catagories.addCategory(state.customCategoryName)

  resetState();
  toast.add({
    title: 'Success',
    description: 'Transaction added successfully!',
  });
}

function resetState() {
  state.store = ''
  state.amount = ''
  state.date = ''
  state.type = TransactionType.EXPENSE
  state.category = '';
  state.customCategory = false;
  state.customCategoryName = '';
}
</script>
