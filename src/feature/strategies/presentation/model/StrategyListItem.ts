import { ListItem } from '../../../../common/app-ui/presentation/AppInfiniteScrollView.tsx'
import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { JsonObject } from '../../../../utils/types.ts'
import { StrategyStatusType } from '../../data/model/StrategyResponse.ts'
import { CurrencyUiModel } from './CurrencyUiModel.ts'
import { LogUiModel } from './LogUiModel.ts'
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
  public readonly options: JsonObject<T>
  public readonly initialAmountA: number
  public readonly approvedA: boolean
  public readonly approvedB: boolean
  public readonly status: StrategyStatusType
  public readonly statusText: string
  public readonly gasLimit: number
  public readonly createdAt: string
  public readonly swaps: SwapUiModel[]
  public readonly waitChangeStatusPlayPause: boolean
  public readonly waitChangeStatusCancel: boolean
  public readonly logs: LogUiModel[]

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
    options: JsonObject<T>,
    initialAmountA: number,
    approvedA: boolean,
    approvedB: boolean,
    status: StrategyStatusType,
    statusText: string,
    gasLimit: number,
    createdAt: string,
    swaps: SwapUiModel[],
    waitChangeStatusPlayPause: boolean,
    waitChangeStatusCancel: boolean,
    logs: LogUiModel[]
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
    this.options = options
    this.initialAmountA = initialAmountA
    this.approvedA = approvedA
    this.approvedB = approvedB
    this.status = status
    this.statusText = statusText
    this.gasLimit = gasLimit
    this.createdAt = createdAt
    this.swaps = swaps
    this.waitChangeStatusPlayPause = waitChangeStatusPlayPause
    this.waitChangeStatusCancel = waitChangeStatusCancel
    this.logs = logs
  }

  public copy(entity: Partial<StrategyListItem<unknown>>): StrategyListItem<unknown> {
    return Object.assign(Reflect.construct(StrategyListItem, []), this, entity)
  }
}
