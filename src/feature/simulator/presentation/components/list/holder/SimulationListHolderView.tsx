import { motion } from 'framer-motion'
import { ForwardedRef, forwardRef } from 'react'
import styled from 'styled-components'
import DeleteIcon from '../../../../../../assets/icons/app/DeleteIcon.svg'
import { AppIconButton } from '../../../../../../common/app-ui/AppIconButton.tsx'
import { ListItemHolder } from '../../../../../../common/app-ui/AppInfiniteScrollView.tsx'
import { ChainIconView } from '../../../../../../common/app-ui/ChainIconView.tsx'
import { ComponentSize } from '../../../../../../common/app-ui/ComponentSize.ts'
import { ProfitValueContainer } from '../../../../../../common/app-ui/ProfitValueContainer.tsx'
import { TokenIconView } from '../../../../../../common/app-ui/TokenIconView.tsx'
import { SimulationStatus } from '../../../../data/model/SimulationStatus.ts'
import { SimulationListItemClickId } from '../../../../domain/router/SimulationListItemClickId.ts'
import { SimulationListItemModel } from '../../../model/SimulationListItemModel.ts'

const Container = styled(motion.div)`
  border: 1px solid #747474;
  padding: 12px 12px 12px;
  border-radius: ${({theme}) => theme.size.borderRadius.small};
  background: ${({theme}) => theme.color.background};
  max-width: 640px;
  width: 100%;
`

const ContainerHeader = styled.div`
  display: grid;
  grid-template-columns: 25px 50px 1fr 1fr 30px;
  align-items: center;
  padding-bottom: 12px;
  text-align: center;
  margin-bottom: 12px;
  border-bottom: 1px solid;
  gap: 8px;

  > div {
    display: flex;
    justify-content: start;
    align-items: center;
  }
`

const ElementContainer = styled.div`
  display: flex;
  align-items: center;
  //height: 24px;
  overflow: hidden;
`

const TextUnderline = styled.span`
  text-decoration: underline;
  cursor: pointer;
`

const StableCoinContainer = styled.span<{ $highlight: boolean }>`
  color: ${({$highlight, theme}) => $highlight ? '#ade25d' : theme.color.text.primary};
`

const SwapsLogsBlock = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;

  > div {
    margin-top: 4px;
  }

  > div:last-child {
    margin-bottom: 0;
  }
`

const SwapContainer = styled.div`
  cursor: pointer;
  display: flex;
  padding: 4px 8px;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  border: 1px solid gray;
  font-size: ${({theme}) => theme.size.fontSize.small};
`

const SwapItemDateContainer = styled.span`
  text-align: end;
`

const SwapSubItem = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 8px;
  overflow: hidden;
`

const StatusContainer = styled.div<{ $status: SimulationStatus }>`
  color: ${({theme, $status}) => {
    if ($status === SimulationStatus.FINISHED) {
      return theme.color.common.green
    } else if ($status === SimulationStatus.WAIT || $status === SimulationStatus.IN_PROGRESS) {
      return theme.color.common.orange
    } else if ($status === SimulationStatus.FAILED) {
      return theme.color.common.red
    }
  }}
`
const HumanReadableStatus = new Map<SimulationStatus, string>([
  [SimulationStatus.FAILED, 'Failed'],
  [SimulationStatus.WAIT, 'Wait in queue (wait for start)'],
  [SimulationStatus.IN_PROGRESS, 'In progress (wait for completion)'],
  [SimulationStatus.FINISHED, 'Finished']
])

export interface SimulationListHolderProps extends ListItemHolder<SimulationListItemModel> {
}

export const SimulationListHolderView = forwardRef((
  {item, onItemClick}: SimulationListHolderProps,
  ref: ForwardedRef<HTMLDivElement>
) => {

  return (
    <Container
      ref={ref}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{exit: {duration: 0.1}}}
    >
      <ContainerHeader>
        <ChainIconView chain={item.chain} size={ComponentSize.SMALL} />

        <ElementContainer>
          <TokenIconView
            chain={item.chain}
            address={item.currencyA.address}
            symbol={item.currencyA.symbol}
            size={ComponentSize.SMALL}
          />
           <TokenIconView
             chain={item.chain}
             address={item.currencyB.address}
             symbol={item.currencyB.symbol}
             size={ComponentSize.SMALL}
           />
        </ElementContainer>

        <div>
           <ElementContainer>{item.currencyA.symbol} &#10230; {item.currencyB.symbol}</ElementContainer>
        </div>

        <div>
          <ElementContainer>
            <StableCoinContainer $highlight={(item.totalAmountA > 0) || false}>{item.totalAmountA}</StableCoinContainer>
            &nbsp;/&nbsp;
            {item.totalAmountB}
        </ElementContainer>
        </div>

        {
          item.status !== SimulationStatus.IN_PROGRESS
            ? (
              <AppIconButton
                icon={<DeleteIcon />}
                size={ComponentSize.SMALLEST}
                onClick={() => onItemClick(item.hash, SimulationListItemClickId.BUTTON_DELETE_ID)}
              />
            )
            : undefined
        }

      </ContainerHeader>

      <ElementContainer>
        Status:&nbsp; <StatusContainer $status={item.status}>{HumanReadableStatus.get(item.status)}</StatusContainer>
      </ElementContainer>

       <ElementContainer>
        Initial amount:&nbsp; <StableCoinContainer $highlight={true}>${item.initialAmountA}</StableCoinContainer>
      </ElementContainer>

      <ElementContainer>
        Unrealized profit:&nbsp; <ProfitValueContainer $value={item.profit}>${item.profit}</ProfitValueContainer>
      </ElementContainer>

      <ElementContainer>
        Date range:&nbsp; {item.fromDate} / {item.toDate}
      </ElementContainer>

      <ElementContainer>
        Exchange count:&nbsp; {item.exchangeCount}
      </ElementContainer>

      <ElementContainer>
        Take profit:&nbsp; {item.options.growDiffPercentsUp}%
      </ElementContainer>
      <ElementContainer>
        Falling:&nbsp; {item.options.growDiffPercentsDown}%
      </ElementContainer>
      <ElementContainer>
        Stop loss:&nbsp; {item.options.stopLossPercents ? item.options.stopLossPercents + '%' : '-'}
      </ElementContainer>
      <ElementContainer>
        Max price:&nbsp; {
        item.options.buyMaxPrice
          ? <StableCoinContainer $highlight={true}>${item.options.buyMaxPrice}</StableCoinContainer>
          : '-'
      }
      </ElementContainer>


      {item.latestExchanges.length === 0
        ? undefined
        : (
          <SwapsLogsBlock onClick={() => {}}>
            <div>
              Latest swaps <TextUnderline
              onClick={() => onItemClick(
                item.hash,
                SimulationListItemClickId.BUTTON_SWAP_MORE_ID
              )}
            >
              (see more...)
            </TextUnderline>:
            </div>
            {item.latestExchanges.map((swap, index) => (
              <SwapContainer key={index}>
                <SwapSubItem>
                  <TokenIconView
                    chain={item.chain}
                    address={swap.addressFrom}
                    symbol={swap.symbolFrom}
                    size={ComponentSize.SMALLEST}
                  />
                  <span>
                    {swap.amountFrom} {
                    swap.addressFrom === item.currencyB.address
                      ? ` ($${swap.exchangeUsdPrice})`
                      : ''
                  }
                  </span>
                  <span>&#10230;</span>
                  <TokenIconView
                    chain={item.chain}
                    address={swap.addressTo}
                    symbol={swap.symbolTo}
                    size={ComponentSize.SMALLEST}
                  />
                  <span>
                    {swap.amountTo}{swap.addressTo === item.currencyB.address ? ` ($${swap.exchangeUsdPrice})` : ''}
                  </span>
                </SwapSubItem>
                <SwapItemDateContainer>{swap.date}</SwapItemDateContainer>
              </SwapContainer>
            ))}
          </SwapsLogsBlock>
        )
      }

    </Container>
  )
})
