import { StrategyResponse } from '../../../../common/repository/data/model/StrategyResponse.ts'
import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { StrategyRepository } from './StrategyRepository.ts'

export class StrategyRepositoryImpl extends StrategyRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
  }

  public async getStrategy(hash: string): Promise<StrategyResponse> {
    const result = await this.appSourceService.get<StrategyResponse>(`/strategy/${hash}`)

    if (result.success && result.data) {
      return StrategyResponse.valueOfJson(result.data)
    }

    throw new Error()
  }
}
