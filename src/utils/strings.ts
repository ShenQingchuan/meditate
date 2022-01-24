const ChinesePuncRegExp =
  /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;

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
