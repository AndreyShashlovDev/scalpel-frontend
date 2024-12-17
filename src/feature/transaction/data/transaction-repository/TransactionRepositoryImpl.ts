import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { SortOrder } from '../../../../common/repository/data/model/SortOrder.ts'
import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { UnknownException } from '../../../../common/repository/data/source/exception/UnknownException.ts'
import { TransactionResponse } from '../model/TransactionResponse.ts'
import { TransactionRepository } from './TransactionRepository.ts'

export class TransactionRepositoryImpl extends TransactionRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
  }

  public async getTransactions(page: number, limit: number): Promise<Pageable<TransactionResponse>> {
    return this.appSourceService.get<Pageable<TransactionResponse>, Pageable<TransactionResponse>>(
      {
        path: '/transaction',
        query: new Map([
          ['page', page.toString()],
          ['limit', limit.toString()],
          ['order', new SortOrder<TransactionResponse>([{key: 'createdAt', order: 'desc'}]).toQuery()]
        ])
      },
      async (response) => {
        if (response.success && response.data) {
          return new Pageable(
            response.data.data.map(TransactionResponse.valueOfJson),
            response.data.total,
            response.data.page
          )
        }

        throw UnknownException.create()
      }
    )
  }
}
