import { ChainType } from '../../repository/data/model/ChainType.ts'
import { EthereumService } from './EthereumService.ts'
import { EthereumServiceStrategy } from './EthereumServiceStrategy.ts'

export class EthereumServiceStrategyImpl extends EthereumServiceStrategy {

  constructor(private services: Map<ChainType, EthereumService>) {
    super()
  }

  public get(chain: ChainType): EthereumService {
    const service = this.services.get(chain)
    if (!service) {
      throw new Error(`service not found for chain ${chain}`)
    }

    return service
  }
}
