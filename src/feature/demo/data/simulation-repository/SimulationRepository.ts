import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { SimulationResponse } from '../model/SimulationResponse.ts'

export abstract class SimulationRepository {

  public abstract getDemoSimulations(
    page: number,
    limit: number,
  ): Promise<Pageable<SimulationResponse>>
}
