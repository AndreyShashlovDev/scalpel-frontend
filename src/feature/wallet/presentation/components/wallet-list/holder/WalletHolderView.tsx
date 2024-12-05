import { motion } from 'framer-motion'
import { ForwardedRef, forwardRef, useState } from 'react'
import styled from 'styled-components'
import EditIcon from '../../../../../../assets/icons/app/EditIcon.svg'
import SaveIcon from '../../../../../../assets/icons/app/SaveIcon.svg'
import { AppAddressView } from '../../../../../../common/app-ui/presentation/AppAddressView.tsx'
import { AppButton } from '../../../../../../common/app-ui/presentation/AppButton.tsx'
import { AppIconButton } from '../../../../../../common/app-ui/presentation/AppIconButton.tsx'
import { ChainIconView } from '../../../../../../common/app-ui/presentation/ChainIconView.tsx'
import { ComponentSize } from '../../../../../../common/app-ui/presentation/ComponentSize.ts'
import { ComponentVariant } from '../../../../../../common/app-ui/presentation/ComponentVariant.ts'
import { LoadingView } from '../../../../../../common/app-ui/presentation/LoadingView.tsx'
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
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid ${({theme}) => theme.color.button.normal.border.primary!};
`

const FeeContainer = styled.div`
  margin: 8px 0;
  padding: 4px;
  border: 1px solid ${({theme}) => theme.color.button.normal.border.primary!};
  border-radius: ${({theme}) => theme.size.borderRadius.small};
`

const FeeTitleContainer = styled.div`
  margin-bottom: 8px;
  border-bottom: 1px solid ${({theme}) => theme.color.button.normal.border.primary!};
`

const FeeItemContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 4px;
`

const CurrencyContainer = styled.div`
  margin: 8px 0;
  padding: 4px;
  border: 1px solid ${({theme}) => theme.color.button.normal.border.primary!};
  border-radius: ${({theme}) => theme.size.borderRadius.small};
`

const CurrencyItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  padding: 8px;
`

const CurrencyItemAmountContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 4px;
`

const GreenColor = styled.span`
  color: ${({theme}) => theme.color.common.green}
`

const WithdrawButtonWrapper = styled(AppButton)`
  width: 60px;
`

const ActionsContainer = styled.div`
  display: flex;
  flex-flow: wrap;
  gap: 8px;
  padding: 12px 0;
`

export interface WalletListHolderProps {
  item: WalletListItemModel
  onItemClick: (viewId: number, data: unknown) => void
}

export const WalletHolderView = forwardRef((
  {item, onItemClick}: WalletListHolderProps,
  ref: ForwardedRef<HTMLDivElement>
) => {

  const [isEditName, setIsEditName] = useState(false)

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
      <LineContainer>Name: {item.name}&nbsp;
        <AppIconButton
          icon={isEditName ? <SaveIcon /> : <EditIcon />}
          size={ComponentSize.SMALL}
          onClick={() => {setIsEditName(!isEditName)}}
        />
      </LineContainer>
      <LineContainer>Total orders: {item.totalOrders}</LineContainer>
      <LineContainer>Active orders: {item.activeOrders}</LineContainer>
      <LineContainer>Total profit: <GreenColor>${NumberShortener(item.totalUsdProfit)}</GreenColor></LineContainer>
      <ActionsContainer>
        <AppButton
          variant={ComponentVariant.DANGER}
          size={ComponentSize.SMALL}
          onClick={() => {}} text={'Export private key'}
        />
      </ActionsContainer>
      <FeeContainer>
        <FeeTitleContainer>Total fee:</FeeTitleContainer>
        {
          Array.from((item.totalFee.entries()))
            .map(([chain, fee]) => (
              <FeeItemContainer key={chain}>
                <ChainIconView
                  chain={chain}
                  size={ComponentSize.SMALLEST}
                />
                &nbsp;
                {NumberShortener(fee.eth, 5)}
                &nbsp;
                {fee.usd !== undefined
                  ? `( $${NumberShortener(fee.usd)} )`
                  : <LoadingView size={ComponentSize.SMALLEST} />
                }
              </FeeItemContainer>
            ))
        }
      </FeeContainer>
      {
        Array.from(item.currencies.keys()).map(chain => (
          <CurrencyContainer>
            <ChainTitleContainer>
              <ChainIconView showChainName={true} chain={chain} size={ComponentSize.SMALLEST} />
              (Total in-use / Total Balance)
            </ChainTitleContainer>
            {
              Array.from((item.currencies.get(chain)?.values() ?? []))
                .map(({amount, currency, actualBalance}) => (
                  <CurrencyItemContainer key={currency.address + currency.chain}>
                    <CurrencyItemAmountContainer>
                      <TokenIconView
                        chain={currency.chain}
                        address={currency.address}
                        symbol={currency.symbol}
                        size={ComponentSize.SMALLEST}
                      />
                      &nbsp;
                      {currency.symbol}
                      &nbsp;
                      {amount} / {actualBalance !== undefined
                      ? actualBalance
                      : <LoadingView size={ComponentSize.SMALLEST} />
                    }
                    </CurrencyItemAmountContainer>
                    {
                      actualBalance && actualBalance > amount
                        ? (
                          <WithdrawButtonWrapper
                            onClick={() => {onItemClick(1, currency)}}
                            size={ComponentSize.SMALL}
                            text={'Withdraw'}
                          />
                        )
                        : undefined
                    }
                  </CurrencyItemContainer>
                ))
            }
          </CurrencyContainer>
        ))
      }
    </Container>
  )
})
