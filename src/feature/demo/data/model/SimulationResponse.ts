import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { CurrencyResponse } from '../../../../common/repository/data/model/CurrencyResponse.ts'
import { StrategyType } from '../../../../common/repository/data/model/StrategyType.ts'
import { JsonObject } from '../../../../utils/types.ts'
import { ExchangeSimulationResultResponse } from './ExchangeSimulationResultResponse.ts'
import { SimulationStatus } from './SimulationStatus.ts'

export class SimulationResponse {

  public static valueOfJson(
    json: JsonObject<SimulationResponse>,
  ): SimulationResponse {
    return new SimulationResponse(
      json.id,
      ChainType[json.chain],
      StrategyType[json.type],
      CurrencyResponse.valueOfJson(json.currencyA),
      CurrencyResponse.valueOfJson(json.currencyB),
      json.totalAmountA,
      json.totalAmountB,
      json.options,
      json.initialAmountA,
      SimulationStatus[json.status],
      new Date(json.fromDate.toString()),
      new Date(json.toDate.toString()),
      json.exchangeCount,
      new Date(json.createdAt.toString()),
      Array.isArray(json.latestExchanges) ? json.latestExchanges.map(ExchangeSimulationResultResponse.valueOfJson) : []
    )
  }

  public readonly id: number
  public readonly chain: ChainType
  public readonly type: StrategyType
  public readonly currencyA: CurrencyResponse
  public readonly currencyB: CurrencyResponse
  public readonly totalAmountA: string
  public readonly totalAmountB: string
  public readonly options: JsonObject<unknown>
  public readonly initialAmountA: string
  public readonly status: SimulationStatus
  public readonly fromDate: Date
  public readonly toDate: Date
  public readonly exchangeCount: number
  public readonly createdAt: Date
  public readonly latestExchanges: ExchangeSimulationResultResponse[]

  constructor(
    id: number,
    chain: ChainType,
    type: StrategyType,
    currencyA: CurrencyResponse,
    currencyB: CurrencyResponse,
    totalAmountA: string,
    totalAmountB: string,
    options: JsonObject<unknown>,
    initialAmountA: string,
    status: SimulationStatus,
    fromDate: Date,
    toDate: Date,
    exchangeCount: number,
    createdAt: Date,
    latestExchanges: ExchangeSimulationResultResponse[],
  ) {
    this.id = id
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
  }
}
