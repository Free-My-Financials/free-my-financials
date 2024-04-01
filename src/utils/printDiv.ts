export default function (divName: string): string {
  const printContents = document.getElementById(divName)?.innerHTML
  const w = window.open()
  if (printContents != null) {
    w?.document.write(printContents)
    w?.print()
    w?.close()
    return 'Printed'
  } else {
    return 'Cannot print'
  }
}
