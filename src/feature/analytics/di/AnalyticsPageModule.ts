import { Module } from '@di-core/decorator/decorators.ts'
import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { AnalyticsRepository } from '../data/analytics-repository/AnalyticsRepository.ts'
import { AnalyticsRepositoryImpl } from '../data/analytics-repository/AnalyticsRepositoryImpl.ts'
import { AnalyticsPagePresenter } from '../domain/AnalyticsPagePresenter.ts'
import { AnalyticsPageRouter } from '../router/AnalyticsPageRouter.ts'

@Module({
  providers: [
    {
      provide: AnalyticsPageRouter,
      deps: [ApplicationRouter],
      useFactory: (appRouter: ApplicationRouter) => appRouter
    },
    {
      provide: AnalyticsRepository,
      useClass: AnalyticsRepositoryImpl,
    },
    {
      provide: AnalyticsPagePresenter,
      deps: [AnalyticsRepository, AnalyticsPageRouter],
      useFactory: async (analyticsRepository: AnalyticsRepository, router: AnalyticsPageRouter) => {
        const module = await import('../domain/AnalyticsPagePresenterImpl.ts')
        return new module.AnalyticsPagePresenterImpl(analyticsRepository, router)
      }
    }
  ],
  exports: [AnalyticsPagePresenter]
})
export class AnalyticsPageModule {}
