import { Module } from 'flexdi'
import { CurrencyRepository } from '../repository/data/currencies/CurrencyRepository.ts'
import { CurrencyRepositoryImpl } from '../repository/data/currencies/CurrencyRepositoryImpl.ts'
import { PreferencesRepository } from '../repository/data/preferences/PreferencesRepository.ts'
import { PreferencesRepositoryImpl } from '../repository/data/preferences/PreferencesRepositoryImpl.ts'
import { WalletRepository } from '../repository/data/wallet/WalletRepository.ts'
import { WalletRepositoryImpl } from '../repository/data/wallet/WalletRepositoryImpl.ts'
import { SourceModule } from './SourceModule.ts'

@Module({
  imports: [SourceModule],
  providers: [
    {
      provide: PreferencesRepository,
      useClass: PreferencesRepositoryImpl
    },
    {
      provide: CurrencyRepository,
      useClass: CurrencyRepositoryImpl,
    },
    {
      provide: WalletRepository,
      useClass: WalletRepositoryImpl,
    }
  ],
  exports: [PreferencesRepository, CurrencyRepository, WalletRepository]
})
export class RepositoryModule {}
