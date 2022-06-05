const patternDot = /(\d{4})\.(\d{1,2})\.(\d{1,2})/
const patternSlash = /(\d{4})\/(\d{1,2})\/(\d{1,2})/
const patternDash = /(\d{4})-(\d{1,2})-(\d{1,2})/
const datePatterns = [
  patternDot,
  patternSlash,
  patternDash,
]

export function parseDate(dateString: string): [Date, [number, number, number]] | null {
  for (const pattern of datePatterns) {
    const regExecResult = pattern.exec(dateString)
    if (regExecResult !== null) {
      const [
        yearString,
        monthString,
        dayString,
      ] = [
        regExecResult[1],
        regExecResult[2],
        regExecResult[3],
      ]

      const year = Number(yearString)
      const month = Number(monthString)
      const day = Number(dayString)

      const dateObj = new Date(Date.parse(dateString))

      return [dateObj, [year, month, day]]
    }
  }

  return null
}
