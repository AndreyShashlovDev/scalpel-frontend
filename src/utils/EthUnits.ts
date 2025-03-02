import BigNumber from 'bignumber.js'

const factorWei = new BigNumber(10).pow(18)
const factorGwei = new BigNumber(10).pow(9)

export const WeiToEther = (value?: string): number => {
  return !value ? 0 : new BigNumber(value).div(factorWei).toNumber()
}

export const GweiToEther = (value?: string): number => {
  return !value ? 0 : new BigNumber(value).div(factorGwei).toNumber()
}
