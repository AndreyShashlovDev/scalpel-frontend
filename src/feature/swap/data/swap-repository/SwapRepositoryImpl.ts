import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { SortOrder } from '../../../../common/repository/data/model/SortOrder.ts'
import { SwapResponse } from '../../../../common/repository/data/model/SwapResponse.ts'
import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { SwapRepository, SwapsSortOrder } from './SwapRepository.ts'

export class SwapRepositoryImpl extends SwapRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
  }

  public async getSwaps(
    strategyHash: string,
    page: number,
    limit: number,
    order: SortOrder<SwapsSortOrder>
  ): Promise<Pageable<SwapResponse>> {
    const result = await this.appSourceService.get<Pageable<SwapResponse>>(`/strategy/${strategyHash}/swap`, {
      query: new Map([
        ['page', page.toString()],
        ['limit', limit.toString()],
        ['order', order.toQuery()]
      ])
    })

    if (result.success && result.data) {
      return new Pageable(
        result.data.data.map(SwapResponse.valueOfJson),
        result.data.total,
        result.data.page
      )
    }

    throw new Error()
  }
}
