import { ListItem } from '../../../../common/app-ui/presentation/AppInfiniteScrollView.tsx'
import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { SwapState } from '../../../../common/repository/data/model/SwapResponse.ts'

export class SwapListItemModel implements ListItem {

  public readonly hash: string
  public readonly id: number
  public readonly chain: ChainType
  public readonly currencyFromSymbol: string
  public readonly currencyToSymbol: string
  public readonly currencyFrom: string
  public readonly currencyTo: string
  public readonly valueFrom: number
  public readonly valueTo: number
  public readonly scalpelFeeAmount?: string
  public readonly accumulatorFeeAmount?: string
  public readonly txHash?: string
  public readonly txFee?: string
  public readonly state: SwapState
  public readonly updateAt: string

  constructor(
    hash: string,
    id: number,
    chain: ChainType,
    currencyFromSymbol: string,
    currencyToSymbol: string,
    currencyFrom: string,
    currencyTo: string,
    valueFrom: number,
    valueTo: number,
    scalpelFeeAmount: string | undefined,
    accumulatorFeeAmount: string | undefined,
    txHash: string | undefined,
    txFee: string | undefined,
    state: SwapState,
    updateAt: string
  ) {
    this.hash = hash
    this.id = id
    this.chain = chain
    this.currencyFromSymbol = currencyFromSymbol
    this.currencyToSymbol = currencyToSymbol
    this.currencyFrom = currencyFrom
    this.currencyTo = currencyTo
    this.valueFrom = valueFrom
    this.valueTo = valueTo
    this.scalpelFeeAmount = scalpelFeeAmount
    this.accumulatorFeeAmount = accumulatorFeeAmount
    this.txHash = txHash
    this.txFee = txFee
    this.state = state
    this.updateAt = updateAt
  }
}
