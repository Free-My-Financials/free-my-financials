export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
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
