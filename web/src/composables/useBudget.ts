export type Budget = {
  start_date: Date;
  amount: number;
  end_date: Date;
};

export function get_budget_transactions(transactions: Transaction[], budget: Budget): Transaction[] {
  let new_transactions = []
  for (const transaction of transactions) {
    if (transaction.date >= budget.start_date && transaction.date <= budget.end_date) {
      new_transactions.push(transaction)
    }

  }
  return new_transactions
}

export function calculateTotalBalance(transactions_in_budget: Transaction[], budget_amount: number) {
  let total = 0

  for (const transaction of transactions_in_budget) {
    if (transaction.type === TransactionType.EXPENSE)
      total -= Number(transaction.amount)
    else if (transaction.type === TransactionType.INCOME)
      total += Number(transaction.amount)
  }

  return budget_amount + total
}


export default function useBudget() {
  return useCookie("budget", {
    default: (): Budget => {
      return {
        start_date: new Date(2023, 0, 1),
        amount: 1,
        end_date: new Date(2023, 0, 30),
      };
    },
    sameSite: "lax",
  });
}

