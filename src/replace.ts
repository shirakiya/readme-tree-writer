const removeNoBreakSpace = (str: string): string => {
  // XXX: The raw output of `tree` includes "no-break-space" character.
  // no-break-space appears only in GitHub Actions host as far as I know.
  // I assume that developers write the output of tree command in local machine,
  // and they run this action. If this action writes the output of tree command
  // with no-break-space, there will always be a difference. To avoid this,
  // replace no-break-space to normal space(\u{0020}).
  return str.replace(/[\u00A0]/g, " ")
}

const removeReplacementChar = (str: string): string => {
  // XXX: I don't know why, the replacement character (\u{FFFD}) appears
  // in the output of tree. As workaround, remove the replacement characters.
  return str.replace(/[\uFFFD][\uFFFD]/g, " ")
}

export const replaceTreeOutput = (raw: string): string => {
  return removeReplacementChar(removeNoBreakSpace(raw))
}
