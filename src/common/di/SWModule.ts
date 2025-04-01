import { Module } from '@di-core/decorator/decorators.ts'
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
