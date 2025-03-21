import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { Inject, Injectable } from '../../../../utils/di-core/decorator/decorators.ts'
import { SimulationResponse } from '../model/SimulationResponse.ts'
import { SimulationRepository } from './SimulationRepository.ts'

@Injectable()
export class SimulationRepositoryImpl extends SimulationRepository {

  constructor(
    @Inject(AppSourceService) private readonly appSourceService: AppSourceService
  ) {
    super()
  }

  public async getDemoSimulations(
    page: number,
    limit: number,
  ): Promise<Pageable<SimulationResponse>> {
    const query = new Map([
      ['page', page.toString()],
      ['limit', limit.toString()]
    ])

    return this.appSourceService.get<SimulationResponse[], Pageable<SimulationResponse>>(
      {
        path: `/simulation/best-exchange`,
        query,
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
