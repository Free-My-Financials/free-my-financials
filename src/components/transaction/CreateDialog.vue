<template>
  <UIDialog>
    <UIDialogTrigger as-child>
      <UIButton variant="ghost" size="sm">
        <Plus />
      </UIButton>
    </UIDialogTrigger>
    <UIDialogContent class="sm:max-w-[425px]">
      <UIDialogHeader>
        <UIDialogTitle class="text-2xl">Create Transaction</UIDialogTitle>
      </UIDialogHeader>

      <form @submit="submit">
        <UIFormField v-slot="{ componentField }" name="type">
          <UIFormItem>
            <UIFormLabel>Type</UIFormLabel>
            <UISelect v-bind="componentField">
              <UIFormControl>
                <UISelectTrigger>
                  <UISelectValue placeholder="Select a type" />
                </UISelectTrigger>
              </UIFormControl>
              <UISelectContent>
                <UISelectGroup>
                  <UISelectItem :value="TransactionType.EXPENSE">
                    Expense
                  </UISelectItem>
                  <UISelectItem :value="TransactionType.INCOME">
                    Income
                  </UISelectItem>
                </UISelectGroup>
              </UISelectContent>
            </UISelect>
            <UIFormMessage />
          </UIFormItem>
        </UIFormField>
        <UIFormField v-slot="{ componentField }" name="amount">
          <UIFormItem>
            <UIFormLabel>Amount</UIFormLabel>
            <UIInput
              type="number"
              step="0.01"
              placeholder="Amount"
              v-bind="componentField"
              :default-value="props.amount"
            />
            <UIFormMessage />
          </UIFormItem>
        </UIFormField>
        <UIFormField v-slot="{ componentField }" name="store">
          <UIFormItem>
            <UIFormLabel>Store</UIFormLabel>
            <UIInput
              type="text"
              placeholder="Store"
              v-bind="componentField"
              :default-value="props.store"
            />
            <UIFormMessage />
          </UIFormItem>
        </UIFormField>
        <UIFormField v-slot="{ componentField }" name="category">
          <UIFormItem>
            <UIFormLabel>Category</UIFormLabel>
            <UISelect v-bind="componentField" :default-value="props.category">
              <UIFormControl>
                <UISelectTrigger>
                  <UISelectValue placeholder="Select a category" />
                </UISelectTrigger>
              </UIFormControl>
              <UISelectContent>
                <UISelectGroup>
                  <UISelectItem
                    v-for="validCategory in validCategories"
                    :key="validCategory"
                    :value="validCategory"
                  >
                    {{ validCategory }}
                  </UISelectItem>
                </UISelectGroup>
              </UISelectContent>
            </UISelect>
            <UIFormMessage />
          </UIFormItem>
        </UIFormField>
        <UIFormField v-slot="{ componentField }" name="date">
          <UIFormItem>
            <UIFormLabel>Date</UIFormLabel>
            <UIFormControl>
              <UIDatePicker v-bind="componentField" />
            </UIFormControl>
            <UIFormMessage />
          </UIFormItem>
        </UIFormField>
        <UIDialogFooter>
          <UIButton type="submit">Create</UIButton>
        </UIDialogFooter>
      </form>
    </UIDialogContent>
  </UIDialog>
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Plus } from 'lucide-vue-next'

const transactions = useTransactionStore()
const categories = useCategoryStore()

const props = defineProps<{
  amount?: number
  category?: string
  store?: string
}>()

const validCategories = computed(() => {
  return categories.categories.filter((category) => category !== '')
})

const formSchema = toTypedSchema(
  z.object({
    type: z.nativeEnum(TransactionType),
    amount: z.number().positive().multipleOf(0.01),
    store: z.string(),
    category: z.string(),
    date: z.date(),
  })
)

const form = useForm({
  validationSchema: formSchema,
})

const submit = form.handleSubmit(async (values) => {
  const result = await transactions.addTransaction({
    id: '',
    ...values,
    amount: Math.round(values.amount * 100),
  })

  if (result) form.resetForm()
})
</script>
