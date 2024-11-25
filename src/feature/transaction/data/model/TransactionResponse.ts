import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { JsonObject } from '../../../../utils/types.ts'

export interface CallData {
  from: string
  to: string
  method: string
  args: JsonObject<unknown>
}

export enum TxStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
  IN_PROGRESS = 'IN_PROGRESS'
}

export class TransactionResponse {

  public static valueOfJson(entity: JsonObject<TransactionResponse>): TransactionResponse {
    return new TransactionResponse(
      entity.id,
      entity.chain,
      entity.recipientAddress,
      entity.address,
      entity.gasMaxPrice,
      entity.txFee,
      entity.hash,
      entity.nonce,
      entity.blockNumber,
      entity.success,
      entity.errorReason,
      entity.callData,
      entity.executedAt ? new Date(entity.executedAt.toString()) : undefined,
      new Date(entity.createdAt.toString()),
      new Date(entity.updatedAt.toString())
    )
  }

  public readonly id: number
  public readonly chain: ChainType
  public readonly recipientAddress: string
  public readonly address: string
  public readonly gasMaxPrice: number
  public readonly txFee?: string
  public readonly hash?: string
  public readonly nonce: number
  public readonly blockNumber?: string
  public readonly success?: TxStatus
  public readonly errorReason?: string
  public readonly callData: JsonObject<CallData>
  public readonly executedAt?: Date
  public readonly createdAt: Date
  public readonly updatedAt: Date

  constructor(
    id: number,
    chain: ChainType,
    recipientAddress: string,
    address: string,
    gasMaxPrice: number,
    txFee: string | undefined,
    hash: string | undefined,
    nonce: number,
    blockNumber: string | undefined,
    success: TxStatus | undefined,
    errorReason: string | undefined,
    callData: JsonObject<CallData>,
    executedAt: Date | undefined,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id
    this.chain = chain
    this.recipientAddress = recipientAddress
    this.address = address
    this.gasMaxPrice = gasMaxPrice
    this.txFee = txFee
    this.hash = hash
    this.nonce = nonce
    this.blockNumber = blockNumber
    this.success = success
    this.errorReason = errorReason
    this.callData = callData
    this.executedAt = executedAt
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
