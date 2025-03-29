import { Module } from '../../utils/di-core/di/Dependency.ts'
import { SWService } from '../service/sw/SWService.ts'

@Module({
  providers: [
    {
      provide: SWService,
      useClass: SWService
    },
  ],
  exports: [SWService]
})
export class SWModule {}
