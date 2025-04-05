import { Module } from 'flexdi'
import { TransactionRepository } from '../data/transaction-repository/TransactionRepository.ts'
import { TransactionRepositoryImpl } from '../data/transaction-repository/TransactionRepositoryImpl.ts'
import { TransactionPagePresenter } from '../domain/TransactionPagePresenter.ts'
import { TransactionPagePresenterImpl } from '../domain/TransactionPagePresenterImpl.ts'

@Module({
  providers: [
    {
      provide: TransactionRepository,
      useClass: TransactionRepositoryImpl
    },
    {
      provide: TransactionPagePresenter,
      useClass: TransactionPagePresenterImpl
    }
  ],
  exports: [TransactionPagePresenter]
})
export class TransactionsPageModule {}
