import { motion } from 'framer-motion'
import { ForwardedRef, forwardRef, ReactNode, useCallback, useState } from 'react'
import styled from 'styled-components'
import DeleteIcon from '../../../../../../assets/icons/app/DeleteIcon.svg'
import FailIcon from '../../../../../../assets/icons/app/FailIcon.svg'
import LogIcon from '../../../../../../assets/icons/app/LogIcon.svg'
import PauseIcon from '../../../../../../assets/icons/app/PauseIcon.svg'
import PlayIcon from '../../../../../../assets/icons/app/PlayIcon.svg'
import SuccessIcon from '../../../../../../assets/icons/app/SuccessIcon.svg'
import WarningIcon from '../../../../../../assets/icons/app/WarningIcon.svg'
import { AppAddressView } from '../../../../../../common/app-ui/presentation/AppAddressView.tsx'
import { AppIconButton } from '../../../../../../common/app-ui/presentation/AppIconButton.tsx'
import { AppSpaceView } from '../../../../../../common/app-ui/presentation/AppSpaceView.ts'
import { ComponentSize } from '../../../../../../common/app-ui/presentation/ComponentSize.ts'
import { SwapState } from '../../../../../../common/repository/data/model/SwapResponse.ts'
import { StrategyStatusType } from '../../../../data/model/StrategyResponse.ts'
import { StrategyHolderButtonIds } from '../../../../domain/StrategyHolderButtonIds.ts'
import { StrategyListItem } from '../../../model/StrategyListItem.ts'

const PlayIconWrapper = styled(PlayIcon)`
  width: 24px;
  height: 24px;
`
const PauseIconWrapper = styled(PauseIcon)`
  width: 24px;
  height: 24px;
`

const DeleteIconWrapper = styled(DeleteIcon)`
  width: 24px;
  height: 24px;
`

const WarningIconWrapper = styled(WarningIcon)`
  width: 16px;
  height: auto;
`

const SuccessIconWrapper = styled(SuccessIcon)`
  width: 16px;
  height: auto;
`

const FailIconWrapper = styled(FailIcon)`
  width: 16px;
  height: auto;
`

const Container = styled(motion.div)`
  border: 1px solid #747474;
  padding: 12px 12px 0;
  border-radius: ${({theme}) => theme.size.borderRadius.small};
  background: ${({theme}) => theme.color.background};
`
const ButtonLogIcon = styled(LogIcon)`
  width: 24px;
  height: 24px;
`

const ElementContainer = styled.div`

`

const StableCoinContainer = styled.span<{ $highlight: boolean }>`
  color: ${({$highlight, theme}) => $highlight ? '#ade25d' : theme.color.text.primary};
`

const SwapsBlock = styled.div`
  > div {
    margin-top: 4px;
  }

  > div:last-child {
    margin-bottom: 0;
  }
`
const SwapItem = styled.div`
  font-size: 10px !important;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 1px solid gray;
`

const DateContainer = styled(ElementContainer)`
  display: flex;
  justify-content: end;
`

const MoreLessContainer = styled.div`
  width: 100%;
  margin-top: 8px;
  cursor: pointer;
  text-align: center;
`

const TextUnderline = styled.span`
  text-decoration: underline;
  cursor: pointer;
`

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 24px;
  margin-bottom: 24px;
`

export interface ScalpelClassicStrategyOptions {
  growDiffPercents?: number,
  growDiffPercentsUp?: number,
  growDiffPercentsDown?: number,
  buyMaxPrice?: number
}

export interface ScalpelClassicStrategyHolderProps {
  item: StrategyListItem<ScalpelClassicStrategyOptions>
  onItemClick: (viewId: number) => void
}

export const ScalpelClassicStrategyHolderView = forwardRef((
  {item, onItemClick}: ScalpelClassicStrategyHolderProps,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const [isMoreInfo, setIsMoreInfo] = useState(false)

  const getShortView = () => {
    return (
      <>
        {item.status === StrategyStatusType.USER_ACTION_REQUIRED && <WarningIconWrapper />}
        <ElementContainer>Chain: {item.chain}</ElementContainer>
        <ElementContainer>Tokens: {item.currencyA.symbol} &#10230; {item.currencyB.symbol}</ElementContainer>
        <ElementContainer>Amount: <StableCoinContainer
          $highlight={(item.totalAmountA > 0) || false}
        >{item.totalAmountA}</StableCoinContainer> / {item.totalAmountB}
        </ElementContainer>
        <AppSpaceView />
        <ElementContainer>Status: {item.status}</ElementContainer>
      </>
    )
  }

  const getFullView = () => {
    return (
      <>
        {getShortView()}
        <AppSpaceView />
        <ElementContainer>Strategy: {item.type}</ElementContainer>
        <ElementContainer>Wallet: <AppAddressView address={item.wallet} /></ElementContainer>
        <AppSpaceView />
        <ElementContainer>Stable coin: {item.currencyA.symbol}</ElementContainer>
        <ElementContainer>Initial amount: {item.initialAmountA}</ElementContainer>
        <ElementContainer>Current amount: {item.totalAmountA}</ElementContainer>
        <ElementContainer>Approved: {item.approvedA ? 'Yes' : 'No'}</ElementContainer>
        <AppSpaceView />
        <ElementContainer>Token: {item.currencyB.symbol}</ElementContainer>
        <ElementContainer>Current amount: {item.totalAmountB}</ElementContainer>
        <ElementContainer>Approved: {item.approvedB ? 'Yes' : 'No'}</ElementContainer>
        <AppSpaceView />
        <ElementContainer>Max gas price (GWEI): {item.gasLimit}</ElementContainer>
        <ElementContainer>
          Exit point to stable: {item.options.growDiffPercents ?? item.options.growDiffPercentsUp ?? '-'}
        </ElementContainer>
        <ElementContainer>
          Token entry point: {item.options.growDiffPercents ?? item.options.growDiffPercentsDown ?? '-'}
        </ElementContainer>
        <ElementContainer>
          Max token entry price: {item.options.buyMaxPrice ?? '-'}
        </ElementContainer>
      </>
    )
  }

  const getSwapStatusIcon = useCallback((status: SwapState): ReactNode => {
    if (status === SwapState.FAILED || status === SwapState.EXECUTION_FAILED || status === SwapState.CANCELLED) {
      return <FailIconWrapper />
    }
    if (status === SwapState.EXECUTION_SUCCESS) {
      return <SuccessIconWrapper />
    }
    if (status === SwapState.WAIT_FOR_ACTION) {
      return <WarningIconWrapper />
    }
  }, [])

  return (
    <Container
      ref={ref}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      layout
      transition={{
        exit: {duration: 0.1},
      }}
    >
      {isMoreInfo ? getFullView() : getShortView()}
      <DateContainer>{item.createdAt}</DateContainer>

      <ActionButtonsContainer>
        <AppIconButton
          onClick={() => {}}
          text={<DeleteIconWrapper />}
          size={ComponentSize.SMALL}
        />

        <AppIconButton
          onClick={() => {}}
          text={item.status === StrategyStatusType.PAUSED ? <PlayIconWrapper /> : <PauseIconWrapper />}
          size={ComponentSize.SMALL}
        />

        <AppIconButton
          onClick={() => onItemClick(StrategyHolderButtonIds.OPEN_LOGS_BUTTON_ID)}
          text={<ButtonLogIcon />}
          size={ComponentSize.SMALL}
        />
      </ActionButtonsContainer>

      {item.swaps.length > 0 && (
        <SwapsBlock onClick={() => onItemClick(StrategyHolderButtonIds.OPEN_SWAP_BUTTON_ID)}>
          <div>
            Latest swaps <TextUnderline>(see more...)</TextUnderline>:
          </div>
          {item.swaps.map((swap, index) => (
            <SwapItem key={index}>
            <div>{swap.symbolFrom} {swap.amountFrom} &#10230; {swap.symbolTo} {swap.amountTo}</div>
              <div>{getSwapStatusIcon(swap.state)}</div>
              {/*<div>{swap.txHash}</div>*/}
              <div>{swap.date}</div>
          </SwapItem>
          ))}
      </SwapsBlock>
      )}
      <MoreLessContainer
        onClick={() => setIsMoreInfo(!isMoreInfo)}
      >
        {isMoreInfo ? 'Less...' : 'More...'}
      </MoreLessContainer>
    </Container>
  )
})
