import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AppAddressView } from '../../../../../common/app-ui/presentation/AppAddressView.tsx'
import { AppInputView } from '../../../../../common/app-ui/presentation/AppInputView.tsx'
import { AppSpaceView } from '../../../../../common/app-ui/presentation/AppSpaceView.tsx'
import { ComponentSize } from '../../../../../common/app-ui/presentation/ComponentSize.ts'
import { ChainType } from '../../../../../common/repository/data/model/ChainType.ts'
import { StrategyOptionsData, StrategyOptionsProps } from './StrategyOptionsProps.ts'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const InputsContainer = styled.div`
  max-width: 300px;
`

const InputElementContainer = styled.div`
  display: grid;
  height: 42px;
  grid-template-columns: 1fr 0.5fr;
  align-items: center;
  text-wrap: balance;
`

const DescContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`

export interface ClassicScalpelOptionsData extends StrategyOptionsData {
  buyMaxPrice: number | undefined
  growDiffPercentsUp: number
  growDiffPercentsDown: number
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

  const [amountStableCoin, setAmountStableCoin] = useState<BigNumber>(new BigNumber(1))
  const [maxBuyPriceCoin, setMaxBuyPriceCoin] = useState<BigNumber | undefined>()
  const [maxGasPrice, setMaxGasPrice] = useState<number>(chain === ChainType.POLYGON ? 300 : 50)
  const [growPercent, setGrowPercent] = useState<number>(0)
  const [fallPercent, setFallPercent] = useState<number>(0)

  useEffect(() => {
    const result: ClassicScalpelOptionsData = {
      tokenAmountA: amountStableCoin.toNumber(),
      tokenAmountB: 0,
      maxGasPriceGwei: maxGasPrice,
      buyMaxPrice: maxBuyPriceCoin?.toNumber() ?? undefined,
      growDiffPercentsDown: fallPercent,
      growDiffPercentsUp: growPercent
    }

    const isValid = result.tokenAmountA > 0 &&
      result.maxGasPriceGwei > 0 &&
      result.growDiffPercentsUp > 0 &&
      result.growDiffPercentsDown > 0

    onChange(result, isValid)

  }, [onChange, amountStableCoin, maxBuyPriceCoin, maxGasPrice, growPercent, fallPercent])

  return (
    <Container>
      <InputsContainer>
        <InputElementContainer>
          amount of stable coin:
            <AppInputView
              size={ComponentSize.SMALL}
              min={1}
              prefix={'$'}
              onChange={e => setAmountStableCoin(new BigNumber(e.target.value || '1'))}
              value={
                Math.min(
                  10000,
                  Number(amountStableCoin.toFixed(3, BigNumber.ROUND_DOWN)),
                ).toString()
              }
              type={'number'}
            />
        </InputElementContainer>

        <InputElementContainer>
          Max token entry price:
          <AppInputView
            type={'number'}
            min={0}
            prefix={'$'}
            onChange={e => setMaxBuyPriceCoin(e.target.value ? new BigNumber(e.target.value) : undefined)}
            value={Number(maxBuyPriceCoin?.toFixed(3, BigNumber.ROUND_DOWN)).toString()}
            size={ComponentSize.SMALL}
          />
        </InputElementContainer>

        <InputElementContainer>
          Max gas price (GWEI):
          <AppInputView
            size={ComponentSize.SMALL}
            min={0}
            max={500}
            onChange={e => setMaxGasPrice(parseInt(e.target.value ?? 0))}
            value={Math.min(500, maxGasPrice).toString()}
            type={'number'}
          />
        </InputElementContainer>

        <InputElementContainer>
          Exit point to stable (percents % ):
          <AppInputView
            min={0.1}
            max={100}
            prefix={'%'}
            onChange={e => setGrowPercent(Number(e.target.value ?? 0))}
            value={Math.min(Number(new BigNumber(growPercent).toFixed(1, BigNumber.ROUND_DOWN)), 100).toString()}
            type={'number'}
            size={ComponentSize.SMALL}
          />
        </InputElementContainer>

        <InputElementContainer>
          Token entry point (percents %):
          <AppInputView
            min={0.1}
            max={100}
            prefix={'%'}
            onChange={e => setFallPercent(Number(e.target.value ?? 0))}
            value={Math.min(Number(new BigNumber(fallPercent).toFixed(1, BigNumber.ROUND_DOWN)), 100).toString()}
            type={'number'}
            size={ComponentSize.SMALL}
          />
        </InputElementContainer>

        <AppSpaceView />

        <DescContainer>
          <div>
            1. Be sure to top up your selected wallet <AppAddressView address={wallet} /> wallet with the amount {Number(
            amountStableCoin.toFixed(3, BigNumber.ROUND_DOWN)).toString()} of {tokenA.symbol + '  '}
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
