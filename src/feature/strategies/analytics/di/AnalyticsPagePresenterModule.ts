import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { Factory, getDIValue, injectionKernel } from '../../../../utils/arch/Injections.ts'
import { AnalyticsRepositoryImpl } from '../data/analytics-repository/AnalyticsRepositoryImpl.ts'
import { AnalyticsPagePresenter } from '../domain/AnalyticsPagePresenter.ts'
import { AnalyticsPagePresenterImpl } from '../domain/AnalyticsPagePresenterImpl.ts'

injectionKernel.set(
  AnalyticsPagePresenter,
  new Factory(
    () => new AnalyticsPagePresenterImpl(
      new AnalyticsRepositoryImpl(getDIValue(AppSourceService))
    ),
    false
  )
)
