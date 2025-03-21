import { SnackbarModule } from '../../../common/app-ui/snackbar/di/SnackbarModule.ts'
import { SnackbarPresenter } from '../../../common/app-ui/snackbar/domain/SnackbarPresenter.ts'
import { RouterModule } from '../../../common/di/AppRouterModule.ts'
import { AuthModule } from '../../../common/di/AuthModule.ts'
import { ExceptionModule } from '../../../common/di/ExceptionModule.ts'
import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { Module } from '../../../utils/di-core/di/Dependency.ts'
import { AppPresenter } from '../domain/AppPresenter.ts'
import { AppPresenterImpl } from '../domain/AppPresenterImpl.ts'
import { AppRouter } from '../router/AppRouter.ts'

@Module({
  imports: [RouterModule, ExceptionModule, AuthModule, SnackbarModule],
  providers: [
    {
      provide: AppRouter,
      deps: [ApplicationRouter],
      useFactory: (appRouter: ApplicationRouter) => appRouter
    },
    {
      provide: AppPresenter,
      useClass: AppPresenterImpl
    }
  ],
  exports: [AppPresenter, SnackbarPresenter]
})
export class AppPageModule {}
