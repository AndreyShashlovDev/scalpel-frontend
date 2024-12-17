import { ListItem } from '../../../../common/app-ui/AppInfiniteScrollView.tsx'
import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { StrategyStatusType } from '../../../../common/repository/data/model/StrategyResponse.ts'
import { JsonObject } from '../../../../utils/types.ts'
import { CurrencyUiModel } from './CurrencyUiModel.ts'
import { LogUiModel } from './LogUiModel.ts'
import { SwapHistoryUiModel } from './SwapHistoryUiModel.ts'
import { SwapUiModel } from './SwapUiModel.ts'

export class StrategyListItem<T> implements ListItem {

  public readonly chain: ChainType
  public readonly type: string
  public readonly hash: string
  public readonly wallet: string
  public readonly currencyA: CurrencyUiModel
  public readonly currencyB: CurrencyUiModel
  public readonly currencyBUsdPrice: number | undefined
  public readonly totalAmountA: number
  public readonly totalAmountB: number
  public readonly adaptiveUsdPrice: number | undefined
  public readonly options: JsonObject<T>
  public readonly initialAmountA: number
  public readonly approvedA: boolean
  public readonly approvedB: boolean
  public readonly status: StrategyStatusType
  public readonly gasLimit: number
  public readonly createdAt: string
  public readonly swaps: SwapUiModel[]
  public readonly waitChangeStatusPlayPause: boolean
  public readonly waitChangeStatusCancel: boolean
  public readonly waitForceExecute: boolean
  public readonly logs: LogUiModel[]
  public readonly totalUsdProfit: number
  public readonly swapsHistory: SwapHistoryUiModel[]

  constructor(
    chain: ChainType,
    type: string,
    hash: string,
    wallet: string,
    currencyA: CurrencyUiModel,
    currencyB: CurrencyUiModel,
    currencyBUsdPrice: number | undefined,
    totalAmountA: number,
    totalAmountB: number,
    adaptiveUsdPrice: number | undefined,
    options: JsonObject<T>,
    initialAmountA: number,
    approvedA: boolean,
    approvedB: boolean,
    status: StrategyStatusType,
    gasLimit: number,
    createdAt: string,
    swaps: SwapUiModel[],
    waitChangeStatusPlayPause: boolean,
    waitChangeStatusCancel: boolean,
    waitForceExecute: boolean,
    logs: LogUiModel[],
    totalUsdProfit: number,
    swapsHistory: SwapHistoryUiModel[],
  ) {
    this.chain = chain
    this.type = type
    this.hash = hash
    this.wallet = wallet
    this.currencyA = currencyA
    this.currencyB = currencyB
    this.currencyBUsdPrice = currencyBUsdPrice
    this.totalAmountA = totalAmountA
    this.totalAmountB = totalAmountB
    this.adaptiveUsdPrice = adaptiveUsdPrice
    this.options = options
    this.initialAmountA = initialAmountA
    this.approvedA = approvedA
    this.approvedB = approvedB
    this.status = status
    this.gasLimit = gasLimit
    this.createdAt = createdAt
    this.swaps = swaps
    this.waitChangeStatusPlayPause = waitChangeStatusPlayPause
    this.waitChangeStatusCancel = waitChangeStatusCancel
    this.waitForceExecute = waitForceExecute
    this.logs = logs
    this.totalUsdProfit = totalUsdProfit
    this.swapsHistory = swapsHistory
  }

  public copy(entity: Partial<StrategyListItem<unknown>>): StrategyListItem<unknown> {
    return Object.assign(Reflect.construct(StrategyListItem, []), this, entity)
  }
}
