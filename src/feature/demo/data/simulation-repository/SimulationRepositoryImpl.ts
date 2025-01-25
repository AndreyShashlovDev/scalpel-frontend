import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { SimulationResponse } from '../model/SimulationResponse.ts'
import { SimulationRepository } from './SimulationRepository.ts'

export class SimulationRepositoryImpl extends SimulationRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
  }

  public async getDemoSimulations(
    page: number,
    limit: number,
  ): Promise<Pageable<SimulationResponse>> {
    console.log(page, limit)
    return this.appSourceService.get<SimulationResponse[], Pageable<SimulationResponse>>(
      {
        path: `/simulation/best-exchange`,
      },
      async (response) => {
        if (response.success && response.data) {
          return new Pageable(
            response.data.map(SimulationResponse.valueOfJson),
            response.data.length,
            1
          )
        }

        throw new Error()
      }
    )
  }
}
