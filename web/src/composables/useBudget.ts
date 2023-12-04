import { ref } from 'vue';
interface Budget {
  amount: number;
  start_date: Date;
  end_date: Date;
}

export default function useBudget() {
  const budget = ref<Budget>({
    amount: 0,
    start_date: new Date(),
    end_date: new Date(),
  });

  return budget;
}
