import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { Module } from '../../../utils/di-core/decorator/decorators.ts'
import { SplashPageRouter } from '../domain/router/SplashPageRouter.ts'
import { SplashPagePresenter } from '../domain/SplashPagePresenter.ts'
import { SplashPagePresenterImpl } from '../domain/SplashPagePresenterImpl.ts'

@Module({
  imports: [],
  providers: [
    {
      provide: SplashPageRouter,
      deps: [ApplicationRouter],
      useFactory: (appRouter: ApplicationRouter) => appRouter
    },
    {
      provide: SplashPagePresenter,
      useClass: SplashPagePresenterImpl
    },
  ],
  exports: [SplashPagePresenter]
})
export class SplashPageModule {}
