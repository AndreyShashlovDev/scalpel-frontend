import { StrategyStatusType } from './StrategyResponse.ts'

export class Preference {

  public readonly strategyFilters: StrategyStatusType[]

  constructor(strategyFilters: StrategyStatusType[]) {
    this.strategyFilters = strategyFilters
  }
}
