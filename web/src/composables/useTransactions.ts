export enum TransactionType {
  INCOME = "Income",
  EXPENSE = "Expense",
}

export type Transaction = {
  id: number
  type: TransactionType
  store: string
  amount: number
  date: Date
  category: string;
}

export default function () {
  return useCookie(
    "transactions",
    {
      default: (): Transaction[] => [],
      sameSite: "lax",
    },
  )
}
