import BigNumber from 'bignumber.js'
import { BytesLike, Contract, Interface, Provider } from 'ethers'
import { Address } from '../../../../utils/types.ts'

export interface Call {
  address: Address;
  name: string;
  params: unknown[];
  gasRequired?: BigNumber;
}

/*
 const CONSERVATIVE_BLOCK_GAS_LIMIT = BigNumber(10_000_000) // conservative estimate of the block gas limit
 const DEFAULT_GAS_REQUIRED = BigNumber(200_000) // default gas required per call

 const chunkCallsArray = (
 items: Call[],
 gasLimit: BigNumber = CONSERVATIVE_BLOCK_GAS_LIMIT.multipliedBy(10)
 ): Call[][] => {
 const chunks: Call[][] = []
 let currentChunk: Call[] = []
 let currentChunkCumulativeGas = BigNumber(0)

 for (let i = 0; i < items.length; i++) {
 const item = items[i] as Call

 const gasRequired = item.gasRequired || DEFAULT_GAS_REQUIRED

 if (currentChunk.length === 0 || currentChunkCumulativeGas.plus(gasRequired).lt(gasLimit)) {
 currentChunk.push(item)
 currentChunkCumulativeGas = currentChunkCumulativeGas.plus(gasRequired)
 } else {
 chunks.push(currentChunk)
 currentChunk = [item]
 currentChunkCumulativeGas = gasRequired
 }
 }

 if (currentChunk.length > 0) {
 chunks.push(currentChunk)
 }

 return chunks
 }
 */

export const multiCallExecute = async <T>(
  provider: Provider,
  multiCallContractAddress: string,
  abi: Interface,
  calls: Call[]
): Promise<T[]> => {
  const multiCallContract = new Contract(multiCallContractAddress, [
    'function aggregate(tuple(address target, bytes callData)[] calls) public view returns (uint256 blockNumber, bytes[] returnData)',
  ], provider)

  const callData = calls.map((call) => ({
    target: call.address.toLowerCase(),
    callData: abi.encodeFunctionData(call.name, call.params),
  }))

  const [, returnData] = await multiCallContract.aggregate(callData)

  return returnData.map((result: BytesLike, i: number) => {
    try {
      return abi.decodeFunctionResult(calls[i].name, result)
    } catch (e) {
      console.error(`Error decoding result for ${calls[i].name}:`, e)
      return null
    }
  })
}

// Пример использования:
//
// const provider = new providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
// const multiCallAddress = '0x1F98415757620B543A52E61c46B32eB19261F984'; // Адрес контракта Multicall
//
// const abi = new utils.Interface([
//   'function balanceOf(address owner) view returns (uint256)',
//   'function totalSupply() view returns (uint256)',
// ]);
//
// const calls: Call[] = [
//   {
//     address: '0xAddress1',
//     name: 'balanceOf',
//     params: ['0xYourAddress'],
//   },
//   {
//     address: '0xAddress2',
//     name: 'totalSupply',
//     params: [],
//   },
// ];
//
// const execute = async () => {
//   const results = await multiCallExecute(provider, multiCallAddress, abi, calls);
//   console.log(results);
// };
//
// execute();
