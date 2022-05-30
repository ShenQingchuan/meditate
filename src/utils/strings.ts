import {ChinesePuncRegExp} from '../constants'

export function wrapByTerminalWidth(str: string, width: number): string[] {
  const slices: string[] = []
  // algorithm: split `str` to several substrings,
  // their terminal width are all `len`
  let accumulatedString = ''
  let accumulatedWidth = 0
  for (const element of str) {
    const w = terminalStringWidth(element)
    if (accumulatedWidth + w > width) {
      slices.push(accumulatedString)
      accumulatedString = ''
      accumulatedWidth = 0
    } else {
      accumulatedString += element
      accumulatedWidth += w
    }
  }

  return slices
}

export function isChineseFull(char: string): boolean {
  return ChinesePuncRegExp.test(char) || (char >= '\u4E00' && char <= '\u9FFF')
}

export function terminalStringWidth(str: string): number {
  let count = 0
  for (const element of str) {
    count += isChineseFull(element) ? 2 : 1
  }

  return count
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function padString(content: any, padLength: number): string {
  return `${content}`.padStart(padLength, ' ').padEnd(padLength, ' ')
}
