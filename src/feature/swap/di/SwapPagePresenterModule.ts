import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { Factory, getDIValue, injectionKernel } from '../../../utils/arch/Injections.ts'
import { StrategyRepositoryImpl } from '../data/strategy-repository/StrategyRepositoryImpl.ts'
import { SwapRepositoryImpl } from '../data/swap-repository/SwapRepositoryImpl.ts'
import { SwapPagePresenter } from '../domain/SwapPagePresenter.ts'
import { SwapPagePresenterImpl } from '../domain/SwapPagePresenterImpl.ts'

injectionKernel.set(SwapPagePresenter, new Factory(() => new SwapPagePresenterImpl(
      new StrategyRepositoryImpl(getDIValue(AppSourceService)),
      new SwapRepositoryImpl(getDIValue(AppSourceService)),
    )
    , false
  )
)
