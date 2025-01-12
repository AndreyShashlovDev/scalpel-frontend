import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { UnknownException } from '../../../../common/repository/data/source/exception/UnknownException.ts'
import { StrategyRequest } from '../../../create-strategy/data/strategy-repository/StrategyRepository.ts'
import { CreateScalpelStrategySimulationRequest } from '../model/CreateScalpelStrategySimulationRequest.ts'
import { SimulationRequest } from '../model/SimulationRequest.ts'
import { SimulationResponse } from '../model/SimulationResponse.ts'
import { SimulationRepository } from './SimulationRepository.ts'

export class SimulationRepositoryImpl extends SimulationRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
  }

  public async getSimulations(
    page: number,
    limit: number,
  ): Promise<Pageable<SimulationResponse>> {
    return this.appSourceService.get<Pageable<SimulationResponse>, Pageable<SimulationResponse>>(
      {
        path: `/simulation`,
        query: new Map([
          ['page', page.toString()],
          ['limit', limit.toString()],
        ])
      },
      async (response) => {
        if (response.success && response.data) {
          return new Pageable(
            response.data.data.map(SimulationResponse.valueOfJson),
            response.data.total,
            response.data.page
          )
        }

        throw new Error()
      }
    )
  }

  public createStrategy(strategy: StrategyRequest): Promise<void> {
    return this.appSourceService.post<void, void>(
      {
        path: '/simulation',
        body: new SimulationRequest(new CreateScalpelStrategySimulationRequest(
          strategy.type,
          strategy.chain,
          strategy.stableToken,
          strategy.targetToken,
          strategy.stableTokenAmount,
          strategy.diffPercentUp,
          strategy.diffPercentDown,
          strategy.maxBuyPrice,
          strategy.stopLossPercents,
        ))
      },
      async (response) => {
        if (response.success) {
          return
        }

        throw UnknownException.create()
      }
    )
  }

  public async deleteSimulation(simulationId: number): Promise<void> {
    await this.appSourceService.delete<void, void>(
      {
        path: `/simulation/${simulationId}`,
      },
      async (response) => {
        if (response.success) {
          return
        }

        throw UnknownException.create(JSON.stringify(response.errors))
      }
    )
  }
}
