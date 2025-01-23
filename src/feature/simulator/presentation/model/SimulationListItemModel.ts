import { ListItem } from '../../../../common/app-ui/AppInfiniteScrollView.tsx'
import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { CurrencyResponse } from '../../../../common/repository/data/model/CurrencyResponse.ts'
import { StrategyType } from '../../../../common/repository/data/model/StrategyType.ts'
import { JsonObject } from '../../../../utils/types.ts'
import { SimulationStatus } from '../../data/model/SimulationStatus.ts'
import { SimulationResultListItemModel } from './SimulationResultListItemModel.ts'

export interface ScalpelStrategyOptions {
  growDiffPercentsUp: number,
  growDiffPercentsDown: number,
  stopLossPercents: number | undefined,
  buyMaxPrice: string | number | undefined
}

export class SimulationListItemModel implements ListItem {

  public readonly hash: string
  public readonly id: number
  public readonly chain: ChainType
  public readonly type: StrategyType
  public readonly currencyA: CurrencyResponse
  public readonly currencyB: CurrencyResponse
  public readonly totalAmountA: number
  public readonly totalAmountB: number
  public readonly options: JsonObject<ScalpelStrategyOptions>
  public readonly initialAmountA: number
  public readonly status: SimulationStatus
  public readonly fromDate: string
  public readonly toDate: string
  public readonly exchangeCount: number
  public readonly createdAt: string
  public readonly latestExchanges: SimulationResultListItemModel[]
  public readonly profit: number

  constructor(
    id: number,
    chain: ChainType,
    type: StrategyType,
    currencyA: CurrencyResponse,
    currencyB: CurrencyResponse,
    totalAmountA: number,
    totalAmountB: number,
    options: JsonObject<ScalpelStrategyOptions>,
    initialAmountA: number,
    status: SimulationStatus,
    fromDate: string,
    toDate: string,
    exchangeCount: number,
    createdAt: string,
    latestExchanges: SimulationResultListItemModel[],
    profit: number,
  ) {
    this.id = id
    this.hash = id.toString()
    this.chain = chain
    this.type = type
    this.currencyA = currencyA
    this.currencyB = currencyB
    this.totalAmountA = totalAmountA
    this.totalAmountB = totalAmountB
    this.options = options
    this.initialAmountA = initialAmountA
    this.status = status
    this.fromDate = fromDate
    this.toDate = toDate
    this.exchangeCount = exchangeCount
    this.createdAt = createdAt
    this.latestExchanges = latestExchanges
    this.profit = profit
  }
}
