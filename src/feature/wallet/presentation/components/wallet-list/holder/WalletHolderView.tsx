import { motion } from 'framer-motion'
import { ForwardedRef, forwardRef } from 'react'
import styled from 'styled-components'
import { AppAddressView } from '../../../../../../common/app-ui/presentation/AppAddressView.tsx'
import { ChainIconView } from '../../../../../../common/app-ui/presentation/ChainIconView.tsx'
import { ComponentSize } from '../../../../../../common/app-ui/presentation/ComponentSize.ts'
import { TokenIconView } from '../../../../../../common/app-ui/presentation/TokenIconView.tsx'
import { NumberShortener } from '../../../../../../utils/Shortener.ts'
import { WalletListItemModel } from '../../../model/WalletListItemModel.ts'

const Container = styled(motion.div)`
  border: 1px solid #747474;
  padding: 12px;
  border-radius: ${({theme}) => theme.size.borderRadius.small};
  max-width: 640px;
  width: 100%;
`

const LineContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 4px;
`

const ChainTitleContainer = styled.div`
  margin-bottom: 8px;
  border-bottom: 1px solid ${({theme}) => theme.color.button.normal.border.primary!};
`

const CurrencyContainer = styled.div`
  margin: 8px 0;
  padding: 4px;
  border: 1px solid ${({theme}) => theme.color.button.normal.border.primary!};
  border-radius: ${({theme}) => theme.size.borderRadius.small};
`

const CurrencyItemContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 4px;
`

const GreenColor = styled.span`
  color: ${({theme}) => theme.color.common.green}
`

export interface WalletListHolderProps {
  item: WalletListItemModel
}

export const WalletHolderView = forwardRef(({item}: WalletListHolderProps, ref: ForwardedRef<HTMLDivElement>) => {
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
      <LineContainer>Address:&nbsp;<AppAddressView address={item.address} /></LineContainer>
      <LineContainer>Name: {item.name}</LineContainer>
      <LineContainer>Total orders: {item.totalOrders}</LineContainer>
      <LineContainer>Active orders: {item.activeOrders}</LineContainer>
      <LineContainer>Total profit: <GreenColor>${NumberShortener(item.totalUsdProfit)}</GreenColor></LineContainer>
      {
        Array.from(item.currencies.keys()).map(chain => (
          <CurrencyContainer>
            <ChainTitleContainer>
              <ChainIconView showChainName={true} chain={chain} size={ComponentSize.SMALLEST} />
            </ChainTitleContainer>
            {
              Array.from((item.currencies.get(chain)?.values() ?? []))
                .map(({amount, currency}) => (
                  <CurrencyItemContainer>
                    <TokenIconView
                      chain={currency.chain}
                      address={currency.address}
                      symbol={currency.symbol}
                      size={ComponentSize.SMALLEST}
                    />
                    &nbsp;
                    {currency.symbol}
                    &nbsp;
                    {NumberShortener(currency.valueTo(amount))}
                  </CurrencyItemContainer>
                ))
            }
          </CurrencyContainer>
        ))
      }
    </Container>
  )
})
