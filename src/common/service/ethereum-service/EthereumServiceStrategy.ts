import { ChainType } from '../../repository/data/model/ChainType.ts'
import { EthereumService } from './EthereumService.ts'

export abstract class EthereumServiceStrategy {

  public abstract get(chain: ChainType): EthereumService
}
