import { StrategyStatusType } from '../../../../common/repository/data/model/StrategyResponse.ts'

export class StrategyTypeFilterItem {

  public readonly key: StrategyStatusType
  public readonly alias: string

  constructor(key: StrategyStatusType, alias: string) {
    this.key = key
    this.alias = alias
  }
}

export class StrategiesFilter {

  public readonly statusFilterItems: StrategyTypeFilterItem[]
  public readonly selectedStatus: Set<StrategyStatusType>

  constructor(statusFilterItems: StrategyTypeFilterItem[], selectedStatus: Set<StrategyStatusType>) {
    this.statusFilterItems = statusFilterItems
    this.selectedStatus = selectedStatus
  }

  public copy(entity: Partial<StrategiesFilter>): StrategiesFilter {
    return Object.assign(Reflect.construct(StrategiesFilter, []), this, entity)
  }
}

export default StrategiesFilter
