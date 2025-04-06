import { Module } from 'flexdi'
import { AppExceptionHandlerService } from '../service/exception-handler/AppExceptionHandlerService.ts'
import { ExceptionHandlerService } from '../service/exception-handler/ExceptionHandlerService.ts'
import { ExceptionNotifierService } from '../service/exception-handler/ExceptionNotifierService.ts'

@Module({
  providers: [
    {
      provide: ExceptionHandlerService,
      useClass: AppExceptionHandlerService
    },
    {
      provide: ExceptionNotifierService,
      useToken: ExceptionHandlerService
    }
  ],
  exports: [ExceptionHandlerService, ExceptionNotifierService],
})
export class ExceptionModule {}
