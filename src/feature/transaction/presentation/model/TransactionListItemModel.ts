import { ListItem } from '../../../../common/app-ui/presentation/AppInfiniteScrollView.tsx'
import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { JsonObject } from '../../../../utils/types.ts'
import { CallData, TxStatus } from '../../data/model/TransactionResponse.ts'

export class TransactionListItemModel implements ListItem {

  public readonly hash: string
  public readonly chain: ChainType
  public readonly recipientAddress: string
  public readonly address: string
  public readonly gasMaxPrice: number
  public readonly txFee?: number
  public readonly txHash?: string
  public readonly nonce: number
  public readonly success?: TxStatus
  public readonly errorReason?: string
  public readonly callData: JsonObject<CallData>
  public readonly executedAt?: string
  public readonly createdAt: string
  public readonly statusText: string

  constructor(
    hash: string,
    chain: ChainType,
    recipientAddress: string,
    address: string,
    gasMaxPrice: number,
    txFee: number | undefined,
    txHash: string | undefined,
    nonce: number,
    success: TxStatus | undefined,
    errorReason: string | undefined,
    callData: JsonObject<CallData>,
    executedAt: string | undefined,
    createdAt: string,
    statusText: string,
  ) {
    this.hash = hash
    this.chain = chain
    this.recipientAddress = recipientAddress
    this.address = address
    this.gasMaxPrice = gasMaxPrice
    this.txFee = txFee
    this.txHash = txHash
    this.nonce = nonce
    this.success = success
    this.errorReason = errorReason
    this.callData = callData
    this.executedAt = executedAt
    this.createdAt = createdAt
    this.statusText = statusText
  }
}
