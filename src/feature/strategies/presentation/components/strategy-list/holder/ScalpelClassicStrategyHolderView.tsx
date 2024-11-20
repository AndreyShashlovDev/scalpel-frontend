import { motion } from 'framer-motion'
import { ForwardedRef, forwardRef, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import ArrowIcon from '../../../../../../assets/icons/app/ArrowIcon.svg'
import DeleteIcon from '../../../../../../assets/icons/app/DeleteIcon.svg'
import EditIcon from '../../../../../../assets/icons/app/EditIcon.svg'
import FailIcon from '../../../../../../assets/icons/app/FailIcon.svg'
import PauseIcon from '../../../../../../assets/icons/app/PauseIcon.svg'
import PlayIcon from '../../../../../../assets/icons/app/PlayIcon.svg'
import SaveIcon from '../../../../../../assets/icons/app/SaveIcon.svg'
import SuccessIcon from '../../../../../../assets/icons/app/SuccessIcon.svg'
import WarningIcon from '../../../../../../assets/icons/app/WarningIcon.svg'
import { AppAddressView } from '../../../../../../common/app-ui/presentation/AppAddressView.tsx'
import { AppIconButton } from '../../../../../../common/app-ui/presentation/AppIconButton.tsx'
import { AppInputView } from '../../../../../../common/app-ui/presentation/AppInputView.tsx'
import { AppSpaceView } from '../../../../../../common/app-ui/presentation/AppSpaceView.tsx'
import { ChainIconView } from '../../../../../../common/app-ui/presentation/ChainIconView.tsx'
import { ComponentSize } from '../../../../../../common/app-ui/presentation/ComponentSize.ts'
import { LoadingView } from '../../../../../../common/app-ui/presentation/LoadingView.tsx'
import { TokenIconView } from '../../../../../../common/app-ui/presentation/TokenIconView.tsx'
import { SwapState } from '../../../../../../common/repository/data/model/SwapResponse.ts'
import { StrategyStatusType } from '../../../../data/model/StrategyResponse.ts'
import { StrategyHolderButtonIds } from '../../../../domain/StrategyHolderButtonIds.ts'
import { StrategyListItem } from '../../../model/StrategyListItem.ts'

const ArrowIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
`

const ArrowIconWrapper = styled(ArrowIcon)<{ angle: number }>`
  width: 24px;
  height: 24px;
  rotate: ${({angle}) => angle}deg;
`

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
  padding: 12px 12px 12px;
  border-radius: ${({theme}) => theme.size.borderRadius.small};
  background: ${({theme}) => theme.color.background};
  max-width: 640px;
  width: 100%;
`

const ContainerHeader = styled.div`
  display: grid;
  grid-template-columns: 36px 50px 1fr 1fr 30px;
  align-items: center;
  padding-bottom: 12px;
  text-align: center;
  margin-bottom: 12px;
  border-bottom: 1px solid;

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const ElementContainer = styled.div`
  display: flex;
  align-items: center;
  //height: 24px;
  overflow: hidden;
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
const LogsContainer = styled.div`
  font-size: 10px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid gray;
  padding-right: 8px;
`

const LogItemContainer = styled.div`
  display: flex;
  place-items: center;
`

const SwapContainer = styled.div`
  font-size: 10px !important;
  display: grid;
  padding: 0 8px;
  grid-template-columns: 20px 1fr 100px;
  justify-content: center;
  gap: 8px;
  align-items: center;
  border: 1px solid gray;
  text-align: end;
`

const SwapSubItem = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 8px;
  overflow: hidden;
`

const TextUnderline = styled.span`
  text-decoration: underline;
  cursor: pointer;
`

const HeaderButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 24px;
  margin-bottom: 24px;
  cursor: pointer;
`
const InputWrapper = styled(AppInputView)`
  width: 100px;
`

const getArrowTrend = (trend: string) => {
  let angle: number | undefined = 10

  if (trend === 'FALLING_CHANGE_TO_NOT_DEFINED' || trend === 'FALLING') {
    angle = 88
  }

  if (trend === 'GROWING_CHANGE_TO_NOT_DEFINED' || trend === 'GROWING') {
    angle = -92
  }

  if (trend === 'FALLING_CHANGE_TO_GROWING') {
    angle = -47
  }

  if (trend === 'GROWING_CHANGE_TO_FALLING') {
    angle = 34
  }

  return angle !== undefined ? <ArrowIconWrapper angle={angle} /> : '??'
}

const PlayStatus = new Set([
  StrategyStatusType.CREATED,
  StrategyStatusType.PAUSED,
  StrategyStatusType.USER_ACTION_REQUIRED,
])

const PauseStatus = new Set([
  StrategyStatusType.IN_PROGRESS,
  StrategyStatusType.APPROVE_IN_PROGRESS,
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

  const getActionButtons = () => {
    return (
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
      </ActionButtonsContainer>
    )
  }

  const getFullView = useCallback(
    () => {
      return (
        <>
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
                      onItemClick(StrategyHolderButtonIds.CHANGE_TOKEN_B_PRICE_BUTTON_ID, maxBuyPriceCoin ?? null)
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
          {getActionButtons()}
      </>
      )
    },
    [
      getActionButtons,
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
    if (status === SwapState.EXECUTION) {
      return <LoadingView size={ComponentSize.SMALLEST} />
    }
  }, [])

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
        <HeaderButtonContainer onClick={() => setIsMoreInfo(!isMoreInfo)}>
          <EditIconWrapper />
        </HeaderButtonContainer>
      </ContainerHeader>
      <ElementContainer>
        Status: {item.statusText}
      </ElementContainer>
      <ElementContainer>
        {item.currencyB.symbol} Price: ${item.currencyBUsdPrice ?? '-'}
      </ElementContainer>

      {isMoreInfo ? getFullView() : undefined}
      <SwapsLogsBlock onClick={() => onItemClick(StrategyHolderButtonIds.OPEN_LOGS_BUTTON_ID)}>
          <div>
            Latest Logs <TextUnderline>(see more...)</TextUnderline>:
          </div>
        {item.logs.map((log, index) => (
          <LogsContainer key={index}>
            <LogItemContainer>
              <ArrowIconContainer>{getArrowTrend(log.trend)}</ArrowIconContainer>{log.diff}
            </LogItemContainer>
            <div>{log.createdAt}</div>
          </LogsContainer>
        ))}
      </SwapsLogsBlock>

      <SwapsLogsBlock onClick={() => onItemClick(StrategyHolderButtonIds.OPEN_SWAP_BUTTON_ID)}>
          <div>
            Latest swaps <TextUnderline>(see more...)</TextUnderline>:
          </div>
        {item.swaps.map((swap, index) => (
          <SwapContainer key={index}>
            <IconContainer>{getSwapStatusIcon(swap.state)}</IconContainer>
            <SwapSubItem>
              <TokenIconView
                chain={item.chain}
                address={swap.addressFrom}
                symbol={swap.symbolFrom}
                size={ComponentSize.SMALLEST}
              />
              <span>{swap.amountFrom}</span>
              <span>&#10230;</span>
              <TokenIconView
                chain={item.chain}
                address={swap.addressTo}
                symbol={swap.symbolTo}
                size={ComponentSize.SMALLEST}
              />
              <span>{swap.amountTo}</span>
            </SwapSubItem>
            <div>{swap.date}</div>
          </SwapContainer>
        ))}
      </SwapsLogsBlock>
    </Container>
  )
})
