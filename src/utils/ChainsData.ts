import { ethers } from 'ethers'
import { ChainType } from '../common/repository/data/model/ChainType.ts'

export interface NativeCurrency {
  symbol: string
}

export const ChainNativeCurrency = new Map<ChainType, NativeCurrency>([
  [ChainType.POLYGON, {symbol: 'POL'}],
  [ChainType.ETHEREUM_MAIN_NET, {symbol: 'ETH'}]
])

export const ChainName = new Map<ChainType, string>([
  [ChainType.POLYGON, 'Polygon'],
  [ChainType.ETHEREUM_MAIN_NET, 'Ethereum']
])

export const WeiToEth = (value: string) : number => {
  return Number(ethers.formatUnits(value, 18))
}
