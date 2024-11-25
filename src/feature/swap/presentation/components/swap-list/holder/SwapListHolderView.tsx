import { motion } from 'framer-motion'
import { ForwardedRef, forwardRef } from 'react'
import styled from 'styled-components'
import { AppSpaceView } from '../../../../../../common/app-ui/presentation/AppSpaceView.tsx'
import { AppTxHashView } from '../../../../../../common/app-ui/presentation/AppTxHashView.tsx'
import { ComponentSize } from '../../../../../../common/app-ui/presentation/ComponentSize.ts'
import { TokenIconView } from '../../../../../../common/app-ui/presentation/TokenIconView.tsx'
import { ChainNativeCurrency } from '../../../../../../utils/ChainNativeCurrency.ts'
import { SwapListItemModel } from '../../../model/SwapListItemModel.ts'
import { SwapStateView } from '../SwapStatusView.tsx'

const Container = styled(motion.div)`
  border: 1px solid #747474;
  padding: 12px;
  border-radius: ${({theme}) => theme.size.borderRadius.small};
  font-size: small;
  max-width: 640px;
  width: 100%;
`

const DateContainer = styled.div`
  text-align: end;
`

const TxFeeContainer = styled.div`
  display: flex;
  place-items: center;
  gap: 4px;
`

const GreenColor = styled.span`
  color: ${({theme}) => theme.color.common.green}
`
const LineContainer = styled.div`
  display: flex;
  place-items: center;
  gap: 4px;
  padding: 4px 0;
`

export interface SwapListHolderProps {
  item: SwapListItemModel
}

export const SwapListHolderView = forwardRef(({item}: SwapListHolderProps, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <Container
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0, scaleY: 0}}
      layout
      transition={{
        exit: {duration: 0.1},
      }}
      ref={ref}
    >
      <div>State:&nbsp;<SwapStateView state={item.state} /></div>
      <AppSpaceView />
      <LineContainer>
        Pair:
        <TokenIconView
          chain={item.chain}
          address={item.currencyFrom}
          symbol={item.currencyFromSymbol}
          size={ComponentSize.SMALLEST}
        />
        {item.currencyFromSymbol}
        &#10230;
        <TokenIconView
          chain={item.chain}
          address={item.currencyTo}
          symbol={item.currencyToSymbol}
          size={ComponentSize.SMALLEST}
        />
        {item.currencyToSymbol}</LineContainer>
      <div>Amounts: {item.valueFrom ?? '?'} &#10230; {item.valueTo ?? '?'}</div>
      <LineContainer>
        {item.currencyB === item.currencyTo ? item.currencyToSymbol : item.currencyFromSymbol} price:
        ${item.exchangeUsdPrice}
      </LineContainer>
      {
        item.profit
          ? (
            <LineContainer>
              Profit:
              <TokenIconView
                chain={item.chain}
                address={item.currencyB === item.currencyTo ? item.currencyFrom : item.currencyTo}
                symbol={item.currencyB === item.currencyTo ? item.currencyFromSymbol : item.currencyToSymbol}
                size={ComponentSize.SMALLEST}
              />
              <GreenColor>{Number(item.profit) > 0 ? '+' : '-'}{item.profit} ({item.profitPercent}%)</GreenColor>
            </LineContainer>
          )
          : undefined
      }

      <AppSpaceView />
      {item.txHash && <div>tx hash: <AppTxHashView hash={item.txHash} chain={item.chain} /></div>}
      {}
      {item.txFee && (
        <TxFeeContainer>
          <span>tx fee:</span>
          <TokenIconView
            chain={item.chain}
            address={'0xffffffffffffffffffffffffffffffffffffffff'}
            symbol={ChainNativeCurrency.get(item.chain)?.symbol ?? ''}
            size={ComponentSize.SMALLEST}
          />
          {item.txFee}
        </TxFeeContainer>
      )
      }
      <DateContainer>{item.updateAt}</DateContainer>
    </Container>
  )
})
