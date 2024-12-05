import BigNumber from 'bignumber.js'
import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { EthereumServiceStrategy } from '../../../../common/service/ethereum-service/EthereumServiceStrategy.ts'
import { Interactor } from '../../../../utils/arch/Interactor.ts'
import { Address, Pair } from '../../../../utils/types.ts'

export interface GetErc20BalanceParams {
  data: Map<ChainType, Map<Address, Set<Address>>>
}

export class GetErc20BalanceInteractor implements Interactor<GetErc20BalanceParams, Promise<Map<Address, Map<ChainType, Map<Address, BigNumber>>>>> {

  constructor(private readonly ethereumServiceStrategy: EthereumServiceStrategy) {
  }

  public async invoke(params: GetErc20BalanceParams): Promise<Map<Address, Map<ChainType, Map<Address, BigNumber>>>> {
    const result = new Map<Address, Map<ChainType, Map<Address, BigNumber>>>()

    for (const [chain, data] of params.data.entries()) {
      const pairs = Array.from(data.entries())
        .map(([wallet, setOfErc20]) => Array.from(setOfErc20).map(erc20 => new Pair(wallet, erc20)))
        .flat()

      const balances = await this.ethereumServiceStrategy.get(chain).getErc20Balances(pairs)

      Array.from(balances).map(([wallet, balanceResult]) => {
        const byChain = result.get(wallet) ?? new Map<ChainType, Map<Address, BigNumber>>()
        byChain.set(chain, balanceResult)
        result.set(wallet, byChain)
      })
    }

    return result
  }
}
