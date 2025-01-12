import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { StrategyRepository } from '../../../create-strategy/data/strategy-repository/StrategyRepository.ts'
import { SimulationResponse } from '../model/SimulationResponse.ts'

export abstract class SimulationRepository extends StrategyRepository {

  public abstract getSimulations(
    page: number,
    limit: number,
  ): Promise<Pageable<SimulationResponse>>

  public abstract deleteSimulation(simulationId: number): Promise<void>
}
