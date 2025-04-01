import { Module } from '@di-core/decorator/decorators.ts'
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
