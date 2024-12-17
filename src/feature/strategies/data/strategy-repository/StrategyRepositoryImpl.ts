import { LogResponse } from '../../../../common/repository/data/model/LogResponse.ts'
import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { StrategyResponse, StrategyStatusType } from '../../../../common/repository/data/model/StrategyResponse.ts'
import { SwapResponse } from '../../../../common/repository/data/model/SwapResponse.ts'
import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { UnknownException } from '../../../../common/repository/data/source/exception/UnknownException.ts'
import { ChangeOptionsRequest } from '../model/ChangeOptionsRequest.ts'
import { CompositeStrategyResponse } from '../model/CompositeStrategyResponse.ts'
import { SimpleHistoryResponse } from '../model/SimpleHistoryResponse.ts'
import { StrategyRepository } from './StrategyRepository.ts'

export class StrategyRepositoryImpl extends StrategyRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
  }

  public async getCompositeStrategies(page: number, limit: number): Promise<Pageable<CompositeStrategyResponse>> {
    return this.appSourceService.get<Pageable<CompositeStrategyResponse>, Pageable<CompositeStrategyResponse>>(
      {
        path: '/strategy/composite',
        query: new Map([
          ['page', page.toString()],
          ['limit', limit.toString()]
        ])
      },
      async (response) => {
        if (response.success && response.data) {
          return new Pageable(
            response.data.data.map(item => new CompositeStrategyResponse(
              StrategyResponse.valueOfJson(item.strategy),
              item.swaps.map(SwapResponse.valueOfJson),
              item.latestLog ? LogResponse.valueOfJson(item.latestLog) : undefined,
              item.swapHistory.map(SimpleHistoryResponse.valueOfJson),
            )),
            response.data.total,
            response.data.page
          )
        }

        throw UnknownException.create('Cannot get orders')
      }
    )
  }

  public async getStrategies(page: number, limit: number): Promise<Pageable<StrategyResponse>> {
    return this.appSourceService.get<Pageable<StrategyResponse>, Pageable<StrategyResponse>>(
      {
        path: '/strategy',
        query: new Map([
          ['page', page.toString()],
          ['limit', limit.toString()]
        ])
      },
      async (result) => {
        if (result.success && result.data) {
          return new Pageable(
            result.data.data.map(StrategyResponse.valueOfJson),
            result.data.total,
            result.data.page
          )
        }

        throw UnknownException.create()
      }
    )
  }

  public async changeOptions(orderHash: string, options: Partial<ChangeOptionsRequest>): Promise<void> {
    return this.appSourceService.put<void, void>(
      {
        path: `/strategy/${orderHash}/`,
        body: options
      },
      async response => {
        if (response.success) {
          return
        }

        throw UnknownException.create()
      }
    )
  }

  public async getStrategy(hash: string): Promise<StrategyResponse> {
    return this.appSourceService.get<StrategyResponse, StrategyResponse>(
      {
        path: `/strategy/${hash}`
      },
      async (response) => {
        if (response.success && response.data) {
          return StrategyResponse.valueOfJson(response.data)
        }

        throw new Error()
      }
    )
  }

  public async changeStatus(orderHash: string, status: StrategyStatusType): Promise<void> {
    return this.appSourceService.post<void, void>(
      {
        path: `/strategy/${orderHash}/status`,
        query: new Map([['status', status.toString()]])
      },
      async (result) => {
        if (result.success) {
          return
        }

        throw UnknownException.create()
      }
    )
  }

  public async forceExecute(orderHash: string): Promise<void> {
    return this.appSourceService.post<void, void>(
      {
        path: `/strategy/${orderHash}/execute`
      },
      async (result) => {
        if (result.success) {
          return
        }

        throw UnknownException.create()
      }
    )
  }
}
