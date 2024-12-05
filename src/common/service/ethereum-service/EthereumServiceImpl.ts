import BigNumber from 'bignumber.js'
import { Contract, ethers, Interface, JsonRpcProvider, TransactionRequest, Wallet } from 'ethers'
import { toChunk } from '../../../utils/ArrayUtils.ts'
import { Address, HexNumber, Pair } from '../../../utils/types.ts'
import { ChainType } from '../../repository/data/model/ChainType.ts'
import { EthereumService, GasFee, TxReceipt } from './EthereumService.ts'
import { Call, multiCallExecute } from './multicall/EthereumMulticallUtils.ts'

export class EthereumServiceImpl extends EthereumService {

  private readonly provider: JsonRpcProvider

  constructor(
    private readonly chain: ChainType,
    readonly providerUrl: string,
    private readonly multicallAddress: Address,
  ) {
    super()
    this.provider = new ethers.JsonRpcProvider(providerUrl)
  }

  public multicall<T>(abi: Interface, calls: Call[]): Promise<T[]> {
    return multiCallExecute(this.provider, this.multicallAddress, abi, calls)
  }

  public async createContract(address: Address, abi: Interface): Promise<Contract> {
    return new Contract(address, abi, this.provider)
  }

  public async createWallet(pk: string): Promise<Wallet> {
    return new Wallet(pk, this.provider)
  }

  public async estimateGas(data: TransactionRequest): Promise<BigNumber> {
    const result = await this.provider.estimateGas(data)

    return new BigNumber(result.toString())
      .multipliedBy(1.2)
      .integerValue(BigNumber.ROUND_UP)
  }

  public async getGasPrice(): Promise<GasFee> {
    const {gasPrice, maxPriorityFeePerGas, maxFeePerGas} = await this.provider.getFeeData()

    if (this.chain === ChainType.ETHEREUM_MAIN_NET) {
      return {
        maxFeePerGas: maxFeePerGas ? ('0x' + maxFeePerGas.toString(16)) as HexNumber : undefined,
        maxPriorityFeePerGas: maxPriorityFeePerGas ? ('0x' + maxPriorityFeePerGas.toString(16)) as HexNumber
          : undefined,
      }

    } else {
      return {
        gasPrice: gasPrice ? ('0x' + gasPrice.toString(16)) as HexNumber : undefined,
      }
    }
  }

  public async getTransactionReceipt(txHash: string): Promise<TxReceipt | null> {
    const result = await this.provider.getTransactionReceipt(txHash)

    if (result) {
      return {
        gasPrice: new BigNumber(result.gasPrice.toString()),
        gasUsed: new BigNumber(result.gasUsed.toString()),
        blockNumber: new BigNumber(result.blockNumber.toString()),
        logs: result.logs,
        status: result.status ?? -1,
      }
    }

    return null
  }

  public async getErc20Balances(query: Pair<Address, Address>[]): Promise<Map<Address, Map<Address, BigNumber>>> {
    const result = new Map<Address, Map<Address, BigNumber>>()

    const abi = new Interface([
      'function balanceOf(' +
      'address account,' +
      ') public view returns (uint256)',
    ])

    const calls: Call[] = query.map(({key: account, value: erc20}) => {
      return {
        address: erc20,
        name: 'balanceOf',
        params: [account],
      }
    })

    const chunks = toChunk(calls, 50)

    for (const chunk of chunks) {
      const resultOfChunk: BigNumber[] = await this.multicall(abi, chunk)

      chunk.forEach((item, index) => {
        const account = item.params[0] as Address
        const data = result.get(account) ?? new Map<Address, BigNumber>()
        data.set(item.address, new BigNumber(resultOfChunk[index].toString()))
        result.set(account, data)
      })
    }

    return result
  }

  public getNonce(address: Address): Promise<number> {
    return this.provider.getTransactionCount(address)
  }
}
