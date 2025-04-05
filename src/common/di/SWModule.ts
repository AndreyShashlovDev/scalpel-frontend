import { Module } from 'flexdi'
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
