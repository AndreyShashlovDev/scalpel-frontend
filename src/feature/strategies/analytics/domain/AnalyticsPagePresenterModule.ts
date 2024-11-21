import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { Factory, getDIValue, injectionKernel } from '../../../../Injections.ts'
import { AnalyticsRepositoryImpl } from '../data/analytics-repository/AnalyticsRepositoryImpl.ts'
import { AnalyticsPagePresenter } from './AnalyticsPagePresenter.ts'
import { AnalyticsPagePresenterImpl } from './AnalyticsPagePresenterImpl.ts'

injectionKernel.set(
  AnalyticsPagePresenter,
  new Factory(
    () => new AnalyticsPagePresenterImpl(
      new AnalyticsRepositoryImpl(getDIValue(AppSourceService))
    ),
    false
  )
)
