import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { CreateStrategyRequest } from '../model/CreateStrategyRequest.ts'
import { StrategyRepository, StrategyRequest } from './StrategyRepository.ts'

export class StrategyRepositoryImpl extends StrategyRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
  }

  public async createStrategy(strategy: StrategyRequest): Promise<void> {
    const result = await this.appSourceService.post<void>('/strategy/', {
      body: new CreateStrategyRequest(strategy)
    })

    if (result.success) {
      return
    }

    throw new Error()
  }
}
