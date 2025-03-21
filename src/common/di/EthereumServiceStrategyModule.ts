import { Module } from '../../utils/di-core/di/Dependency.ts'
import { ChainType } from '../repository/data/model/ChainType.ts'
import { EthereumServiceImpl } from '../service/ethereum-service/EthereumServiceImpl.ts'
import { EthereumServiceStrategy } from '../service/ethereum-service/EthereumServiceStrategy.ts'
import { EthereumServiceStrategyImpl } from '../service/ethereum-service/EthereumServiceStrategyImpl.ts'

@Module({
  providers: [
    {
      provide: EthereumServiceStrategy,
      useFactory: () => {
        return new EthereumServiceStrategyImpl(
          new Map([
            [
              ChainType.ETHEREUM_MAIN_NET,
              new EthereumServiceImpl(
                ChainType.ETHEREUM_MAIN_NET,
                'https://ethereum-rpc.publicnode.com',
                '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
              ),
            ],
            [
              ChainType.POLYGON,
              new EthereumServiceImpl(
                ChainType.POLYGON,
                'https://1rpc.io/matic',
                '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507',
              ),
            ]
          ])
        )
      }
    }
  ],
  exports: [EthereumServiceStrategy],
  global: true
})
export class EthereumServiceStrategyModule {}
