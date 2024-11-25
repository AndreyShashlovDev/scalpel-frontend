import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { SortOrder } from '../../../../common/repository/data/model/SortOrder.ts'
import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { TransactionResponse } from '../model/TransactionResponse.ts'
import { TransactionRepository } from './TransactionRepository.ts'

export class TransactionRepositoryImpl extends TransactionRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
  }

  public async getTransactions(page: number, limit: number): Promise<Pageable<TransactionResponse>> {
    const result = await this.appSourceService.get<Pageable<TransactionResponse>>('/transaction', {
      query: new Map([
        ['page', page.toString()],
        ['limit', limit.toString()],
        ['order', new SortOrder<TransactionResponse>([{key: 'createdAt', order: 'desc'}]).toQuery()]
      ])
    })

    if (result.success && result.data) {
      return new Pageable(
        result.data.data.map(TransactionResponse.valueOfJson),
        result.data.total,
        result.data.page
      )
    }

    throw new Error()
  }
}
