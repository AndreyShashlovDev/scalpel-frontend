import { Inject, Injectable } from '@di-core/decorator/decorators.ts'
import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { SortOrder } from '../../../../common/repository/data/model/SortOrder.ts'
import { SwapResponse } from '../../../../common/repository/data/model/SwapResponse.ts'
import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { UnknownException } from '../../../../common/repository/data/source/exception/UnknownException.ts'
import { SwapRepository, SwapsSortOrder } from './SwapRepository.ts'

@Injectable()
export class SwapRepositoryImpl extends SwapRepository {

  constructor(
    @Inject(AppSourceService) private readonly appSourceService: AppSourceService
  ) {
    super()
  }

  public async getSwaps(
    strategyHash: string,
    page: number,
    limit: number,
    order: SortOrder<SwapsSortOrder>
  ): Promise<Pageable<SwapResponse>> {
    return this.appSourceService.get<Pageable<SwapResponse>, Pageable<SwapResponse>>(
      {
        path: `/strategy/${strategyHash}/swap`,
        query: new Map([
          ['page', page.toString()],
          ['limit', limit.toString()],
          ['order', order.toQuery()]
        ])
      },
      async (response) => {
        if (response.success && response.data) {
          return new Pageable(
            response.data.data.map(SwapResponse.valueOfJson),
            response.data.total,
            response.data.page
          )
        }

        throw UnknownException.create()
      }
    )
  }
}
