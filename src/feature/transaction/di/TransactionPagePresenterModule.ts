import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { Factory, getDIValue, injectionKernel } from '../../../utils/arch/Injections.ts'
import { TransactionRepositoryImpl } from '../data/transaction-repository/TransactionRepositoryImpl.ts'
import { TransactionPagePresenter } from '../domain/TransactionPagePresenter.ts'
import { TransactionPagePresenterImpl } from '../domain/TransactionPagePresenterImpl.ts'

injectionKernel.set(
  TransactionPagePresenter,
  new Factory(
    () => new TransactionPagePresenterImpl(
      new TransactionRepositoryImpl(getDIValue(AppSourceService)),
    ),
    false
  )
)
