import { Module } from '../../utils/di-core/di/Dependency.ts'
import { ECHDCrypto } from '../service/crypto/ECHDCrypto.ts'
import { ECHDCryptoImpl } from '../service/crypto/ECHDCryptoImpl.ts'

@Module({
  providers: [
    {
      provide: ECHDCrypto,
      useClass: ECHDCryptoImpl
    }
  ],
  exports: [ECHDCrypto]
})
export class ECHDCryptoModule {}
