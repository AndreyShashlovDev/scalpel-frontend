import { StrategyResponse } from '../../../../common/repository/data/model/StrategyResponse.ts'
import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { UnknownException } from '../../../../common/repository/data/source/exception/UnknownException.ts'
import { StrategyRepository } from './StrategyRepository.ts'

export class StrategyRepositoryImpl extends StrategyRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
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

        throw UnknownException.create()
      }
    )
  }
}
