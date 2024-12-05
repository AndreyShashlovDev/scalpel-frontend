import { ethers } from 'ethers'
import { ChainType } from '../common/repository/data/model/ChainType.ts'
import { Address } from './types.ts'

export interface NativeCurrency {
  symbol: string
  wrapped: Address
}

export const ChainNativeCurrency = new Map<ChainType, NativeCurrency>([
  [ChainType.POLYGON, {symbol: 'POL', wrapped: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'}],
  [ChainType.ETHEREUM_MAIN_NET, {symbol: 'ETH', wrapped: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'}]
])

export const ChainName = new Map<ChainType, string>([
  [ChainType.POLYGON, 'Polygon'],
  [ChainType.ETHEREUM_MAIN_NET, 'Ethereum']
])

export const WeiToEth = (value: string) : number => {
  return Number(ethers.formatUnits(value, 18))
}
