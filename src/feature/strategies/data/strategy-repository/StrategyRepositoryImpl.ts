import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { SwapResponse } from '../../../../common/repository/data/model/SwapResponse.ts'
import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { ChangeOptionsRequest } from '../model/ChangeOptionsRequest.ts'
import { CompositeStrategyResponse } from '../model/CompositeStrategyResponse.ts'
import { StrategyResponse, StrategyStatusType } from '../model/StrategyResponse.ts'
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

  public async changeOptions(orderHash: string, options: Partial<ChangeOptionsRequest>): Promise<void> {
    const result = await this.appSourceService.put<Pageable<StrategyResponse>>(`/strategy/${orderHash}/`, {
      body: options
    })

    if (result.success) {
      return
    }

    throw new Error()
  }

  public async getStrategy(hash: string): Promise<StrategyResponse> {
    const result = await this.appSourceService.get<StrategyResponse>(`/strategy/${hash}`)

    if (result.success && result.data) {
      return StrategyResponse.valueOfJson(result.data)
    }

    throw new Error()
  }

  public async changeStatus(orderHash: string, status: StrategyStatusType): Promise<void> {
    const result = await this.appSourceService.post<void>(`/strategy/${orderHash}/status`, {
      query: new Map([['status', status.toString()]])
    })

    if (result.success) {
      return
    }

    throw new Error()
  }
}
