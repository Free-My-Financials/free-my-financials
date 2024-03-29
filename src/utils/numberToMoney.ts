export default function (amount: number): string {
  let result = ''
  result =
    result +
    '$' +
    Math.abs(amount / 100)
      .toFixed(2)
      .toString()
  return result
}
