import { ChainType } from '../common/repository/data/model/ChainType.ts'

const scans = new Map<ChainType, string>([
  [ChainType.ETHEREUM_MAIN_NET, 'https://etherscan.io'],
  [ChainType.POLYGON, 'https://polygonscan.com']
])

export const getTxHashUrl = (txHash: string, chain: ChainType): string => {
  return scans.get(chain) + `/tx/${txHash}`
}
