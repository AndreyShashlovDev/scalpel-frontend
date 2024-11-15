import { motion } from 'framer-motion'
import { ForwardedRef, forwardRef, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import DeleteIcon from '../../../../../../assets/icons/app/DeleteIcon.svg'
import EditIcon from '../../../../../../assets/icons/app/EditIcon.svg'
import FailIcon from '../../../../../../assets/icons/app/FailIcon.svg'
import LogIcon from '../../../../../../assets/icons/app/LogIcon.svg'
import PauseIcon from '../../../../../../assets/icons/app/PauseIcon.svg'
import PlayIcon from '../../../../../../assets/icons/app/PlayIcon.svg'
import SaveIcon from '../../../../../../assets/icons/app/SaveIcon.svg'
import SuccessIcon from '../../../../../../assets/icons/app/SuccessIcon.svg'
import WarningIcon from '../../../../../../assets/icons/app/WarningIcon.svg'
import { AppAddressView } from '../../../../../../common/app-ui/presentation/AppAddressView.tsx'
import { AppIconButton } from '../../../../../../common/app-ui/presentation/AppIconButton.tsx'
import { AppInputView } from '../../../../../../common/app-ui/presentation/AppInputView.tsx'
import { AppSpaceView } from '../../../../../../common/app-ui/presentation/AppSpaceView.tsx'
import { ComponentSize } from '../../../../../../common/app-ui/presentation/ComponentSize.ts'
import { LoadingView } from '../../../../../../common/app-ui/presentation/LoadingView.tsx'
import { SwapState } from '../../../../../../common/repository/data/model/SwapResponse.ts'
import { StrategyStatusType } from '../../../../data/model/StrategyResponse.ts'
import { StrategyHolderButtonIds } from '../../../../domain/StrategyHolderButtonIds.ts'
import { StrategyListItem } from '../../../model/StrategyListItem.ts'

const IconContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
`
const ButtonContainer = styled(IconContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 4px;
`
const SaveIconWrapper = styled(SaveIcon)`
  cursor: pointer;
  width: 16px;
  height: auto;
`

const EditIconWrapper = styled(EditIcon)`
  width: 16px;
  height: auto;
`
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
  display: flex;
  align-items: center;
  height: 24px;
  overflow: hidden;
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
const InputWrapper = styled(AppInputView)`
  width: 100px;
`

const PlayStatus = new Set([
  StrategyStatusType.CREATED,
  StrategyStatusType.PAUSED,
  StrategyStatusType.USER_ACTION_REQUIRED,
])

const PauseStatus = new Set([
  StrategyStatusType.IN_PROGRESS,
  StrategyStatusType.APPROVE_IN_PROGRESS,
  StrategyStatusType.READY
])

export interface ScalpelClassicStrategyOptions {
  growDiffPercents?: number,
  growDiffPercentsUp?: number,
  growDiffPercentsDown?: number,
  buyMaxPrice?: number
}

export interface ScalpelClassicStrategyHolderProps {
  item: StrategyListItem<ScalpelClassicStrategyOptions>
  onItemClick: (viewId: number, data?: unknown) => void
}

export const ScalpelClassicStrategyHolderView = forwardRef((
  {item, onItemClick}: ScalpelClassicStrategyHolderProps,
  ref: ForwardedRef<HTMLDivElement>
) => {

  const [isMoreInfo, setIsMoreInfo] = useState(false)
  const [editGasPrice, setEditGasPrice] = useState(false)
  const [editGrowPercent, setEditGrowPercent] = useState(false)
  const [editFallPercent, setEditFallPercent] = useState(false)
  const [editMaxTokenPrice, setEditMaxTokenPrice] = useState(false)

  const [maxGasPrice, setMaxGasPrice] = useState<number>(item.gasLimit)
  const [growPercent, setGrowPercent] = useState<number>(
    (item.options.growDiffPercentsUp ?? item.options.growDiffPercents ?? 0)
  )
  const [fallPercent, setFallPercent] = useState<number>(
    (item.options.growDiffPercentsDown ?? item.options.growDiffPercents ?? 0)
  )
  const [maxBuyPriceCoin, setMaxBuyPriceCoin] = useState<number | undefined>(item.options.buyMaxPrice)

  useEffect(() => {
    setMaxGasPrice(item.gasLimit)
    setGrowPercent((item.options.growDiffPercentsUp ?? item.options.growDiffPercents ?? 0))
    setFallPercent((item.options.growDiffPercentsDown ?? item.options.growDiffPercents ?? 0))
    setMaxBuyPriceCoin(item.options.buyMaxPrice)

  }, [item.options, item.gasLimit])

  const getShortView = useCallback(() => {
    return (
      <>
        {item.status === StrategyStatusType.USER_ACTION_REQUIRED && <WarningIconWrapper />}
        <ElementContainer>Chain: {item.chain}</ElementContainer>
        <ElementContainer>Tokens: {item.currencyA.symbol} &#10230; {item.currencyB.symbol}</ElementContainer>
        <ElementContainer>Amount:&nbsp;<StableCoinContainer
          $highlight={(item.totalAmountA > 0) || false}
        >{item.totalAmountA}</StableCoinContainer>
          &nbsp;/ {item.totalAmountB}
        </ElementContainer>
        <AppSpaceView />
        <ElementContainer>Status: {item.status}</ElementContainer>
      </>
    )
  }, [item])

  const getFullView = useCallback(
    () => {
      return (
        <>
        {getShortView()}
          <AppSpaceView />
        <ElementContainer>Strategy: {item.type}</ElementContainer>
        <ElementContainer>Wallet:&nbsp;<AppAddressView address={item.wallet} /></ElementContainer>
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
        <ElementContainer>
          Max gas price (GWEI):&nbsp;
          {
            editGasPrice
              ? (
                <>
                  <InputWrapper
                    allowNegative={false}
                    decimals={0}
                    min={1}
                    max={1000}
                    defaultValue={maxGasPrice}
                    allowEmptyValue={false}
                    onChange={(v) => setMaxGasPrice(v!)}
                  />
                  <ButtonContainer
                    onClick={() => {
                      onItemClick(StrategyHolderButtonIds.CHANGE_GAS_PRICE_BUTTON_ID, maxGasPrice)
                      setEditGasPrice(false)
                    }}
                    whileTap={{scale: 0.95}}
                  >
                    <SaveIconWrapper />
                  </ButtonContainer>
                </>
              )
              : (
                <>
                  {maxGasPrice}&nbsp;
                  <ButtonContainer
                    onClick={() => setEditGasPrice(true)}
                    whileTap={{scale: 0.95}}
                  >
                    <EditIconWrapper />
                  </ButtonContainer>
                </>
              )
          }

        </ElementContainer>
        <ElementContainer>
          Exit point to stable:&nbsp;
          {
            editGrowPercent
              ? (
                <>
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

                  <ButtonContainer
                    onClick={() => {
                      onItemClick(StrategyHolderButtonIds.CHANGE_GROW_PERCENT_BUTTON_ID, growPercent)
                      setEditGrowPercent(false)
                    }}
                    whileTap={{scale: 0.95}}
                  >
                    <SaveIconWrapper />
                  </ButtonContainer>
                </>
              )
              : (
                <>
                  {growPercent}%&nbsp;
                  <ButtonContainer
                    onClick={() => setEditGrowPercent(true)}
                    whileTap={{scale: 0.95}}
                  >
                    <EditIconWrapper />
                  </ButtonContainer>
                </>
              )
          }
        </ElementContainer>
        <ElementContainer>
          Token entry point:&nbsp;
          {
            editFallPercent
              ? (
                <>
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

                  <ButtonContainer
                    onClick={() => {
                      onItemClick(StrategyHolderButtonIds.CHANGE_FALL_PERCENT_BUTTON_ID, fallPercent)
                      setEditFallPercent(false)
                    }}
                    whileTap={{scale: 0.95}}
                  >
                    <SaveIconWrapper />
                  </ButtonContainer>
                </>
              )
              : (
                <>
                  {fallPercent}%&nbsp;
                  <ButtonContainer
                    onClick={() => setEditFallPercent(true)}
                    whileTap={{scale: 0.95}}
                  >
                    <EditIconWrapper />
                  </ButtonContainer>
                </>
              )
          }

        </ElementContainer>
        <ElementContainer>
          Max token entry price:&nbsp;
          {
            editMaxTokenPrice
              ? (
                <>
                <InputWrapper
                  allowNegative={false}
                  decimals={3}
                  prefix={'$'}
                  defaultValue={maxBuyPriceCoin}
                  allowEmptyValue={true}
                  onChange={(v) => setMaxBuyPriceCoin(v)}
                />
                  <ButtonContainer
                    onClick={() => {
                      onItemClick(StrategyHolderButtonIds.CHANGE_TOKEN_B_PRICE_BUTTON_ID, maxBuyPriceCoin)
                      setEditMaxTokenPrice(false)
                    }}
                    whileTap={{scale: 0.95}}
                  >
                    <SaveIconWrapper />
                  </ButtonContainer>
                </>
              )
              : (
                <>
                  ${maxBuyPriceCoin ?? '-'} &nbsp;
                  <ButtonContainer
                    onClick={() => setEditMaxTokenPrice(true)}
                    whileTap={{scale: 0.95}}
                  >
                    <EditIconWrapper />
                  </ButtonContainer>
                </>
              )
          }
        </ElementContainer>
      </>
      )
    },
    [
      onItemClick,
      item,
      fallPercent,
      growPercent,
      maxGasPrice,
      maxBuyPriceCoin,
      editFallPercent,
      editGrowPercent,
      editGasPrice,
      editMaxTokenPrice,
      getShortView
    ]
  )

  const getIconPlayPause = useMemo(() => {
    if (PlayStatus.has(item.status)) {
      return <PlayIconWrapper />

    } else if (PauseStatus.has(item.status)) {
      return <PauseIconWrapper />
    }
    return undefined
  }, [item.status])

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
          disabled={item.waitChangeStatusCancel}
          onClick={() => {
            onItemClick(StrategyHolderButtonIds.CANCEL_ORDER_BUTTON_ID)
          }}
          text={item.waitChangeStatusCancel ? <LoadingView size={ComponentSize.SMALL} /> : <DeleteIconWrapper />}
          size={ComponentSize.SMALL}
        />

        {
          getIconPlayPause && (
            <AppIconButton
              disabled={item.waitChangeStatusPlayPause}
              onClick={() => {
                if (PlayStatus.has(item.status)) {
                  onItemClick(StrategyHolderButtonIds.PLAY_ORDER_BUTTON_ID)

                } else if (PauseStatus.has(item.status)) {
                  onItemClick(StrategyHolderButtonIds.PAUSE_ORDER_BUTTON_ID)
                }
              }}
              text={item.waitChangeStatusPlayPause ? <LoadingView size={ComponentSize.SMALL} /> : getIconPlayPause}
              size={ComponentSize.SMALL}
            />
          )
        }

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
              <IconContainer>{getSwapStatusIcon(swap.state)}</IconContainer>
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
