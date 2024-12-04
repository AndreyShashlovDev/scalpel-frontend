import BigNumber from 'bignumber.js'
import { Contract, Interface, TransactionRequest, Wallet } from 'ethers'
import { Address, HexNumber, Pair } from '../../../utils/types.ts'
import { Call } from './multicall/EthereumMulticallUtils.ts'

export interface GasFee {
  gasPrice?: undefined | HexNumber
  maxFeePerGas?: undefined | HexNumber
  maxPriorityFeePerGas?: undefined | HexNumber
}

export interface TxReceipt {
  gasPrice: BigNumber,
  gasUsed: BigNumber,
  blockNumber: BigNumber,
  logs: readonly unknown[],
  status: number,
}

export abstract class EthereumService {

  public abstract multicall<T>(abi: Interface, calls: Call[]): Promise<T[]>

  public abstract createContract(address: Address, abi: Interface): Promise<Contract>

  public abstract getScalpelContractAddress(): Address

  public abstract getUsdAddress(): Address

  public abstract getWrappedNativeAddress(): Address

  public abstract createWallet(pk: string): Promise<Wallet>

  public abstract estimateGas(data: TransactionRequest): Promise<BigNumber>

  public abstract getGasPrice(): Promise<GasFee>

  public abstract getTransactionReceipt(txHash: string): Promise<TxReceipt | null>

  // Map<account,erc20Address>
  public abstract getErc20Balances(query: Pair<Address, Address>[]): Promise<Map<Address, Record<Address, BigNumber>>>

  public abstract getNonce(address: Address): Promise<number>
}
