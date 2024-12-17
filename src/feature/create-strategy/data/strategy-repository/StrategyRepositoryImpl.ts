import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { UnknownException } from '../../../../common/repository/data/source/exception/UnknownException.ts'
import { CreateStrategyRequest } from '../model/CreateStrategyRequest.ts'
import { StrategyRepository, StrategyRequest } from './StrategyRepository.ts'

export class StrategyRepositoryImpl extends StrategyRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
  }

  public async createStrategy(strategy: StrategyRequest): Promise<void> {
    return this.appSourceService.post<void, void>(
      {
        path: '/strategy/',
        body: new CreateStrategyRequest(strategy)
      },
      async (response) => {
        if (response.success) {
          return
        }

        throw UnknownException.create()
      }
    )
  }
}
