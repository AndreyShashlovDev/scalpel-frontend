export const AddressShortener = (text: string): string => {
  return text.substring(0, 10) + '...' + text.substring(32)
}

export const TxHashShortener = (text: string): string => {
  return text.substring(0, 14) + '...' + text.substring(52)
}
