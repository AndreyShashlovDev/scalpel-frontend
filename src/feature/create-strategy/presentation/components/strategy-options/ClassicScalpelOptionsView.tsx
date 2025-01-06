import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AppAddressView } from '../../../../../common/app-ui/AppAddressView.tsx'
import { AppNumberInputView } from '../../../../../common/app-ui/AppNumberInputView.tsx'
import { AppSpaceView } from '../../../../../common/app-ui/AppSpaceView.tsx'
import { ChainType } from '../../../../../common/repository/data/model/ChainType.ts'
import { StrategyOptionsData, StrategyOptionsProps } from './StrategyOptionsProps.ts'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const InputsContainer = styled.div`
  max-width: 80%;
`

const InputElementContainer = styled.div`
  display: grid;
  height: 46px;
  grid-template-columns: 1fr fit-content(90px);
  align-items: center;
  text-wrap: balance;
  text-align: end;
  gap: 8px;
`

const DescContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`

const InputWrapper = styled(AppNumberInputView)`
  max-width: 90px;
`

export interface ClassicScalpelOptionsData extends StrategyOptionsData {
  buyMaxPrice: number | undefined
  growDiffPercentsUp: number
  growDiffPercentsDown: number
  stopLossPercents: number | undefined
}

const CHAIN_NATIVE = new Map([
  [ChainType.POLYGON, 'POLY'],
  [ChainType.ETHEREUM_MAIN_NET, 'ETH']
])

export const ClassicScalpelOptionsView = ({
  onChange,
  chain,
  tokenA,
  wallet,
}: StrategyOptionsProps<ClassicScalpelOptionsData>) => {

  const [amountStableCoin, setAmountStableCoin] = useState<number>(1)
  const [maxBuyPriceCoin, setMaxBuyPriceCoin] = useState<number | undefined>()
  const [stopLoss, setStopLoss] = useState<number | undefined>()
  const [maxGasPrice, setMaxGasPrice] = useState<number>(chain === ChainType.POLYGON ? 300 : 50)
  const [growPercent, setGrowPercent] = useState<number>(0)
  const [fallPercent, setFallPercent] = useState<number>(0)

  useEffect(() => {
    const result: ClassicScalpelOptionsData = {
      tokenAmountA: amountStableCoin,
      tokenAmountB: 0,
      maxGasPriceGwei: maxGasPrice,
      buyMaxPrice: maxBuyPriceCoin ?? undefined,
      stopLossPercents: stopLoss ?? undefined,
      growDiffPercentsDown: fallPercent,
      growDiffPercentsUp: growPercent
    }

    const isValid = result.tokenAmountA > 0 &&
      result.maxGasPriceGwei > 0 &&
      result.growDiffPercentsUp > 0 &&
      result.growDiffPercentsDown > 0

    onChange(result, isValid)

  }, [onChange, amountStableCoin, maxBuyPriceCoin, maxGasPrice, growPercent, fallPercent, stopLoss])

  return (
    <Container>
      <InputsContainer>
        <InputElementContainer>
          Amount of stable coin:
          <InputWrapper
            allowNegative={false}
            decimals={3}
            prefix={'$'}
            min={1}
            max={10000}
            defaultValue={amountStableCoin}
            allowEmptyValue={false}
            onChange={(v) => setAmountStableCoin(v!)}
          />
        </InputElementContainer>

        <InputElementContainer>
          Max token entry price:
          <InputWrapper
            allowNegative={false}
            decimals={3}
            prefix={'$'}
            defaultValue={maxBuyPriceCoin}
            allowEmptyValue={true}
            onChange={(v) => setMaxBuyPriceCoin(v)}
          />
        </InputElementContainer>

        <InputElementContainer>
          Stop-loss (percents % ):
          <InputWrapper
            allowNegative={false}
            decimals={2}
            max={100}
            min={0}
            suffix={'%'}
            defaultValue={stopLoss}
            allowEmptyValue={true}
            onChange={(v) => setStopLoss(v)}
          />
        </InputElementContainer>

        <InputElementContainer>
          Max gas price (GWEI):
          <InputWrapper
            allowNegative={false}
            decimals={0}
            min={1}
            max={1000}
            defaultValue={maxGasPrice}
            allowEmptyValue={false}
            onChange={(v) => setMaxGasPrice(v!)}
          />
        </InputElementContainer>

        <InputElementContainer>
          Exit point to stable (percents % ):
          <InputWrapper
            allowNegative={false}
            decimals={2}
            max={100}
            min={0}
            allowEmptyValue={false}
            defaultValue={growPercent}
            suffix={'%'}
            onChange={(v) => setGrowPercent(v ?? 0)}
          />
        </InputElementContainer>

        <InputElementContainer>
          Token entry point (percents %):
          <InputWrapper
            allowNegative={false}
            decimals={2}
            max={100}
            min={0}
            allowEmptyValue={false}
            defaultValue={fallPercent}
            suffix={'%'}
            onChange={(v) => setFallPercent(v ?? 0)}
          />
        </InputElementContainer>

        <AppSpaceView />

        <DescContainer>
          <div>
            1. Be sure to top up your selected wallet <AppAddressView address={wallet} /> wallet with the amount {amountStableCoin} of {tokenA.symbol +
            '  '}
            <AppAddressView address={tokenA.address} />
          </div>
          <div>
            2. Make sure you have enough {CHAIN_NATIVE.get(chain) ?? chain} funds in the selected wallet, top it up if necessary.
          </div>
        </DescContainer>
      </InputsContainer>
    </Container>
  )
}
