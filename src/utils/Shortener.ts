import BigNumber from 'bignumber.js'

export const PrivateShortener = (text: string): string => {
  return text.substring(0, 12) + '...' + text.substring(30)
}

export const AddressShortener = (text: string): string => {
  return text.substring(0, 12) + '...' + text.substring(30)
}

export const TxHashShortener = (text: string): string => {
  return text.substring(0, 16) + '...' + text.substring(50)
}

export const NumberShortener = (value: number, decimals: number = 2): number => {
  return Number(new BigNumber(value).toFixed(decimals, BigNumber.ROUND_DOWN))
}
