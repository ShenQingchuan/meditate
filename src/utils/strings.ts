import { ChinesePuncRegExp } from '../constants';

export function wrapByTerminalWidth(str: string, width: number): string[] {
  const slices: string[] = [];
  // algorithm: split `str` to several substrings,
  // their terminal width are all `len`
  let accumulatedString = "",
    accumulatedWidth = 0;
  for (let i = 0; i < str.length; i++) {
    const w = terminalStringWidth(str[i]);
    if (accumulatedWidth + w > width) {
      slices.push(accumulatedString);
      accumulatedString = "";
      accumulatedWidth = 0;
    } else {
      accumulatedString += str[i];
      accumulatedWidth += w;
    }
  }
  return slices;
}

export function isChineseFull(char: string) {
  return ChinesePuncRegExp.test(char) || ("\u4e00" <= char && char <= "\u9fff");
}

export function terminalStringWidth(str: string) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (isChineseFull(str[i])) {
      count += 2; // Chinese character occupied 2 columns of terminal
    } else {
      count += 1;
    }
  }
  return count;
}
