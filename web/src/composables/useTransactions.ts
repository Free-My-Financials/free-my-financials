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
