import { Module } from '../../../../utils/di-core/di/Dependency.ts'
import { ExceptionModule } from '../../../di/ExceptionModule.ts'
import { SnackbarPresenter } from '../domain/SnackbarPresenter.ts'
import { SnackbarPresenterImpl } from '../domain/SnackbarPresenterImpl.ts'

@Module({
  imports: [ExceptionModule],
  providers: [
    {
      provide: SnackbarPresenter,
      useClass: SnackbarPresenterImpl
    }
  ],
  exports: [SnackbarPresenter]
})
export class SnackbarModule {}
