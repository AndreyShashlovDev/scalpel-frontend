import { SwapState } from '../../../../common/repository/data/model/SwapResponse.ts'

export class SwapUiModel {

  public readonly addressFrom: string
  public readonly addressTo: string
  public readonly symbolFrom: string
  public readonly symbolTo: string
  public readonly amountFrom: number
  public readonly amountTo: number
  public readonly txHash?: string
  public readonly state: SwapState
  public readonly date: string

  constructor(
    addressFrom: string,
    addressTo: string,
    symbolFrom: string,
    symbolTo: string,
    amountFrom: number,
    amountTo: number,
    txHash: string | undefined,
    state: SwapState,
    date: string
  ) {
    this.addressFrom = addressFrom
    this.addressTo = addressTo
    this.symbolFrom = symbolFrom
    this.symbolTo = symbolTo
    this.amountFrom = amountFrom
    this.amountTo = amountTo
    this.txHash = txHash
    this.state = state
    this.date = date
  }
}
