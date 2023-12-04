export type Budget = {
  start_date: Date
  amount: number
  end_date: Date
}

export default function () {
  return useCookie(
    "budget",
    {
      default: (): Budget => { return { start_date: new Date(2023, 1, 1), amount: 1, end_date: new Date(2023, 1, 30) } },
      sameSite: "lax",
    },
  )
}
