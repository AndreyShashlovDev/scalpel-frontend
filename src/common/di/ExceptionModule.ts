import { Module } from '@di-core/decorator/decorators.ts'
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
      deps: [ExceptionHandlerService],
      useFactory: (exceptionHandler: ExceptionHandlerService) => exceptionHandler,
    }
  ],
  exports: [ExceptionHandlerService, ExceptionNotifierService],
})
export class ExceptionModule {}
