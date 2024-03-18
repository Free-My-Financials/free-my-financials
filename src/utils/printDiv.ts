export default function (divName: string): void {
  const printContents = document.getElementById(divName)?.innerHTML
  const w = window.open()
  if (printContents != null) {
    w?.document.write(printContents)
    w?.print()
    w?.close()
  }
}
