import { type Budget, calculateTotalBalance } from "../../src/composables/useBudget";

describe('calculateTotalBalance', () => {
  test('Budget with no transactions should be its total', () => {
    const budget: Budget = {
      start_date: new Date(2023, 0, 1),
      amount: 100,
      end_date: new Date(2023, 0, 30),
    }
    const emptyTransactionArray: Transaction[] = []

    expect(calculateTotalBalance(emptyTransactionArray, budget.amount)).toBe(100);
  });
});
