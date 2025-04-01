import { Module } from '@di-core/decorator/decorators.ts'
import { ChainType } from '../repository/data/model/ChainType.ts'
import { EthereumServiceStrategy } from '../service/ethereum-service/EthereumServiceStrategy.ts'

@Module({
  providers: [
    {
      provide: EthereumServiceStrategy,
      useFactory: async () => {
        const module = await import('../service/ethereum-service/EthereumServiceStrategyImpl.ts')
        const moduleEthService = await import('../service/ethereum-service/EthereumServiceImpl.ts')

        return new module.EthereumServiceStrategyImpl(
          new Map([
            [
              ChainType.ETHEREUM_MAIN_NET,
              new moduleEthService.EthereumServiceImpl(
                ChainType.ETHEREUM_MAIN_NET,
                'https://ethereum-rpc.publicnode.com',
                '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
              ),
            ],
            [
              ChainType.POLYGON,
              new moduleEthService.EthereumServiceImpl(
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
})
export class EthereumServiceStrategyModule {}
