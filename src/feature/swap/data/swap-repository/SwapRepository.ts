import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { SortOrder } from '../../../../common/repository/data/model/SortOrder.ts'
import { SwapResponse } from '../../../../common/repository/data/model/SwapResponse.ts'

export interface SwapsSortOrder {
  updatedAt: Date
}

export abstract class SwapRepository {

  public abstract getSwaps(
    strategyHash: string,
    page: number,
    limit: number,
    order: SortOrder<SwapsSortOrder>
  ): Promise<Pageable<SwapResponse>>
}
