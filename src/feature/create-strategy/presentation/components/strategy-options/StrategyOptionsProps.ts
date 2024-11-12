import { CurrencyResponse } from '../../../../../common/repository/data/model/CurrencyResponse.ts'

export interface StrategyOptionsData {
  tokenAmountA: number
  tokenAmountB: number
  maxGasPriceGwei: number
}

export interface StrategyOptionsProps<T extends StrategyOptionsData> {

  onChange: (options: T, isFullFilled: boolean) => void
  tokenA: CurrencyResponse
  tokenB: CurrencyResponse
  wallet: string
}
