import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { TransactionResponse } from '../model/TransactionResponse.ts'

export abstract class TransactionRepository {

  public abstract getTransactions(page: number, limit: number): Promise<Pageable<TransactionResponse>>
}
