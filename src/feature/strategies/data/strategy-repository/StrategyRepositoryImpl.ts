import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { SwapResponse } from '../../../../common/repository/data/model/SwapResponse.ts'
import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { Delay } from '../../../../utils/Delay.ts'
import { CompositeStrategyResponse } from '../model/CompositeStrategyResponse.ts'
import { StrategyResponse } from '../model/StrategyResponse.ts'
import { StrategyRepository } from './StrategyRepository.ts'

export class StrategyRepositoryImpl extends StrategyRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
  }

  public async getCompositeStrategies(page: number, limit: number): Promise<Pageable<CompositeStrategyResponse>> {
    const result = await this.appSourceService.get<Pageable<CompositeStrategyResponse>>('/strategy/composite', {
      query: new Map([
        ['page', page.toString()],
        ['limit', limit.toString()]
      ])
    })

    await Delay(1000)
    if (result.success && result.data) {
      return new Pageable(
        result.data.data.map(item => new CompositeStrategyResponse(
          StrategyResponse.valueOfJson(item.strategy),
          item.swaps.map(SwapResponse.valueOfJson)
        )),
        result.data.total,
        result.data.page
      )
    }

    throw new Error()
  }

  public async getStrategies(page: number, limit: number): Promise<Pageable<StrategyResponse>> {
    const result = await this.appSourceService.get<Pageable<StrategyResponse>>('/strategy', {
      query: new Map([
        ['page', page.toString()],
        ['limit', limit.toString()]
      ])
    })

    if (result.success && result.data) {
      return new Pageable(
        result.data.data.map(StrategyResponse.valueOfJson),
        result.data.total,
        result.data.page
      )
    }

    throw new Error()
  }
}
