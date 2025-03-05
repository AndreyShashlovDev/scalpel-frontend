import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { Factory, getDIValue, injectionKernel } from '../../../utils/arch/Injections.ts'
import { LogsRepositoryImpl } from '../data/logs-repository/LogsRepositoryImpl.ts'
import { LogsPagePresenter } from '../domain/LogsPagePresenter.ts'
import { LogsPagePresenterImpl } from '../domain/LogsPagePresenterImpl.ts'

injectionKernel.set(
  LogsPagePresenter,
  new Factory(
    () => new LogsPagePresenterImpl(
      new LogsRepositoryImpl(getDIValue(AppSourceService))
    ),
    false
  )
)
