import { Module } from '../../../../utils/di-core/di/Dependency.ts'
import { AnalyticsRepository } from '../data/analytics-repository/AnalyticsRepository.ts'
import { AnalyticsRepositoryImpl } from '../data/analytics-repository/AnalyticsRepositoryImpl.ts'
import { AnalyticsPagePresenter } from '../domain/AnalyticsPagePresenter.ts'

@Module({
  providers: [
    {
      provide: AnalyticsRepository,
      useClass: AnalyticsRepositoryImpl,
    },
    {
      provide: AnalyticsPagePresenter,
      deps: [AnalyticsRepository],
      useFactory: async (analyticsRepository: AnalyticsRepository) => {
        const module = await import('../domain/AnalyticsPagePresenterImpl.ts')
        return new module.AnalyticsPagePresenterImpl(analyticsRepository)
      }
    }
  ],
  exports: [AnalyticsPagePresenter]
})
export class AnalyticsPageModule {}
