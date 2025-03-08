import BigNumber from 'bignumber.js'

export const PrivateShortener = (text: string): string => {
  return text.substring(0, 10) + '...' + text.substring(54)
}

export const AddressShortener = (text: string): string => {
  return text.substring(0, 10) + '...' + text.substring(32)
}

export const TxHashShortener = (text: string): string => {
  return text.substring(0, 14) + '...' + text.substring(52)
}

export const NumberShortener = (value: number, decimals: number = 2): number => {
  return Number(new BigNumber(value).toFixed(decimals, BigNumber.ROUND_DOWN))
}
