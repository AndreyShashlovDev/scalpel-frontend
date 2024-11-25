import { ethers } from 'ethers'
import { DateUtils } from '../../../../utils/DateUtils.ts'
import { TransactionResponse, TxStatus } from '../../data/model/TransactionResponse.ts'
import { TransactionListItemModel } from '../model/TransactionListItemModel.ts'

const mapStatusText = new Map([
  [TxStatus.SUCCESS, 'Success'],
  [TxStatus.FAILED, 'Failed'],
  [TxStatus.CANCELED, 'Canceled'],
  [undefined, 'Unknown'],
  [null, 'Unknown'],
])

export const TransactionResponseToTransactionListItem = (response: TransactionResponse) => new TransactionListItemModel(
  response.id.toString(),
  response.chain,
  response.recipientAddress,
  response.address,
  response.gasMaxPrice,
  response.txFee ? Number(Number(ethers.formatUnits(response.txFee, 'ether')).toFixed(6)) : undefined,
  response.hash,
  response.nonce,
  response.success ?? (response.hash ? TxStatus.IN_PROGRESS : undefined),
  response.errorReason,
  response.callData,
  response.executedAt ? DateUtils.toFormat(response.executedAt, DateUtils.DATE_FORMAT_SHORT) : undefined,
  DateUtils.toFormat(response.createdAt, DateUtils.DATE_FORMAT_SHORT),
  response.success === undefined && response.hash ? 'In progress' : mapStatusText.get(response.success) ?? 'Unknown'
)
