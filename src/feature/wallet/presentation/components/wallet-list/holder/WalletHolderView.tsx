import { motion } from 'framer-motion'
import { ForwardedRef, forwardRef, useState } from 'react'
import styled from 'styled-components'
import EditIcon from '../../../../../../assets/icons/app/EditIcon.svg'
import SaveIcon from '../../../../../../assets/icons/app/SaveIcon.svg'
import { AppAddressView } from '../../../../../../common/app-ui/AppAddressView.tsx'
import { AppButton } from '../../../../../../common/app-ui/AppButton.tsx'
import { AppIconButton } from '../../../../../../common/app-ui/AppIconButton.tsx'
import { ListItemHolder } from '../../../../../../common/app-ui/AppInfiniteScrollView.tsx'
import { AppTextInputView } from '../../../../../../common/app-ui/AppTextInputView.tsx'
import { ChainIconView } from '../../../../../../common/app-ui/ChainIconView.tsx'
import { ComponentSize } from '../../../../../../common/app-ui/ComponentSize.ts'
import { ComponentVariant } from '../../../../../../common/app-ui/ComponentVariant.ts'
import { LoadingView } from '../../../../../../common/app-ui/LoadingView.tsx'
import { ProfitValueContainer } from '../../../../../../common/app-ui/ProfitValueContainer.tsx'
import { TokenIconView } from '../../../../../../common/app-ui/TokenIconView.tsx'
import { NumberShortener } from '../../../../../../utils/Shortener.ts'
import { WalletListItemIds } from '../../../../domain/model/WalletListItemIds.ts'
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
  padding: 4px;
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
  padding: 4px;
  margin-bottom: 8px;
  border-bottom: 1px solid ${({theme}) => theme.color.button.normal.border.primary!};
`

const FeeItemContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 4px 8px;
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

const CurrencyFooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 4px;
  border-top: 1px solid ${({theme}) => theme.color.button.normal.border.primary!};
`
const CurrencyItemAmountContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`

const GreenColor = styled.span`
  display: flex;
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

const FooterItemContainer = styled.div`
  display: flex;
`

const TextInputWrapper = styled(AppTextInputView)`
  width: 200px;
`

export interface WalletListHolderProps extends ListItemHolder<WalletListItemModel> {
}

export const WalletHolderView = forwardRef((
  {item, onItemClick}: WalletListHolderProps,
  ref: ForwardedRef<HTMLDivElement>
) => {

  const [isEditName, setIsEditName] = useState(false)
  const [walletName, setWalletName] = useState<string | undefined>(item.name ?? '')

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
      <LineContainer>Name: {isEditName
        ? <TextInputWrapper value={walletName} max={15} onChange={v => setWalletName(v)} />
        : walletName
      }&nbsp;
        <AppIconButton
          icon={isEditName ? <SaveIcon /> : <EditIcon />}
          size={ComponentSize.SMALLEST}
          onClick={() => {
            if (isEditName) {
              onItemClick(item.hash, WalletListItemIds.BUTTON_CHANGE_NAME, walletName)
            }

            setIsEditName(!isEditName)
          }}
        />
      </LineContainer>
      <LineContainer>Total orders: {item.totalOrders}</LineContainer>
      <LineContainer>Active orders: {item.activeOrders}</LineContainer>
      <LineContainer>Earned profit:
        <ProfitValueContainer $value={item.totalUsdProfit}>
          ${NumberShortener(item.totalUsdProfit)}
        </ProfitValueContainer>
      </LineContainer>
      <LineContainer>Realized profit:
        <ProfitValueContainer $value={item.realizedUsdProfit}>
          ${NumberShortener(item.realizedUsdProfit)}
        </ProfitValueContainer>
      </LineContainer>
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
                  ? (
                    <>
                      (<GreenColor>${NumberShortener(fee.usd)}</GreenColor>)
                    </>
                  )
                  : <LoadingView size={ComponentSize.SMALLEST} />
                }
              </FeeItemContainer>
            ))
        }
      </FeeContainer>
      {
        Array.from(item.currencies.keys()).map(chain => (
          <CurrencyContainer key={chain}>
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
                      {amount}
                      &nbsp;/&nbsp;
                      {actualBalance !== undefined ? actualBalance : <LoadingView size={ComponentSize.SMALLEST} />}
                      &nbsp;
                      (<GreenColor>${NumberShortener(currency.price?.toUsdValue() ?? 0)}</GreenColor>)
                    </CurrencyItemAmountContainer>
                    {
                      actualBalance && actualBalance > amount
                        ? (
                          <WithdrawButtonWrapper
                            onClick={() => {onItemClick(item.hash, 1, currency)}}
                            size={ComponentSize.SMALL}
                            text={'Withdraw'}
                          />
                        )
                        : undefined
                    }
                  </CurrencyItemContainer>
                ))
            }
            <CurrencyFooterContainer>
              <FooterItemContainer>
                Orders cost / initial:&nbsp;
                <GreenColor>${item.totalValueWalletUsdt.get(chain)}</GreenColor>
                &nbsp;/&nbsp;
                <GreenColor>${NumberShortener(item.totalInitialUsdValue.get(chain) ?? 0)}</GreenColor>
              </FooterItemContainer>
              <FooterItemContainer>
                Wallet cost:&nbsp;<GreenColor>${item.totalActualValueWalletUsdt.get(chain) ??
                <LoadingView size={ComponentSize.SMALLEST} />}</GreenColor>
              </FooterItemContainer>
            </CurrencyFooterContainer>
          </CurrencyContainer>
        ))
      }
    </Container>
  )
})
