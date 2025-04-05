import { Module } from 'flexdi'
import { SCALPEL_ENDPOINT } from '../../AppModule.ts'
import { AppAuthHttpsService } from '../repository/data/source/AppAuthHttpsService.ts'
import { AppSourceService } from '../repository/data/source/AppSourceService.ts'
import { AppSourceServiceImpl } from '../repository/data/source/AppSourceServiceImpl.ts'
import { ExceptionNotifierService } from '../service/exception-handler/ExceptionNotifierService.ts'
import { ExceptionModule } from './ExceptionModule.ts'

@Module({
  imports: [ExceptionModule],
  providers: [
    {
      provide: AppSourceService,
      deps: [ExceptionNotifierService],
      useFactory: (exceptionNotifier: ExceptionNotifierService) => {
        const appAuthHttpsService = new AppAuthHttpsService(SCALPEL_ENDPOINT, 'api')

        return new AppSourceServiceImpl(appAuthHttpsService, exceptionNotifier)
      }
    }
  ],
  exports: [AppSourceService]
})
export class SourceModule {}
