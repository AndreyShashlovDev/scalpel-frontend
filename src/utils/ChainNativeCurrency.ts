import { ChainType } from '../common/repository/data/model/ChainType.ts'

export interface NativeCurrency {
  symbol: string
}

export const ChainNativeCurrency = new Map<ChainType, NativeCurrency>([
  [ChainType.POLYGON, {symbol: 'POL'}],
  [ChainType.ETHEREUM_MAIN_NET, {symbol: 'ETH'}]
])
