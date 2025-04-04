import { domAnimation, LazyMotion, m } from 'framer-motion'
import { ForwardedRef, forwardRef, memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import ArrowIcon from '../../../../../../assets/icons/app/ArrowIcon.svg'
import CollapseArrowIcon from '../../../../../../assets/icons/app/CollapseArrowIcon.svg'
import DeleteIcon from '../../../../../../assets/icons/app/DeleteIcon.svg'
import EditIcon from '../../../../../../assets/icons/app/EditIcon.svg'
import ExitIcon from '../../../../../../assets/icons/app/ExitIcon.svg'
import FailIcon from '../../../../../../assets/icons/app/FailIcon.svg'
import PauseIcon from '../../../../../../assets/icons/app/PauseIcon.svg'
import PlayIcon from '../../../../../../assets/icons/app/PlayIcon.svg'
import SaveIcon from '../../../../../../assets/icons/app/SaveIcon.svg'
import SuccessIcon from '../../../../../../assets/icons/app/SuccessIcon.svg'
import TrashBinIcon from '../../../../../../assets/icons/app/TrashBinIcon.svg'
import WarningIcon from '../../../../../../assets/icons/app/WarningIcon.svg'
import { AppAddressView } from '../../../../../../common/app-ui/AppAddressView.tsx'
import { AppButton } from '../../../../../../common/app-ui/AppButton.tsx'
import { AppIconButton } from '../../../../../../common/app-ui/AppIconButton.tsx'
import { AppNumberInputView } from '../../../../../../common/app-ui/AppNumberInputView.tsx'
import { AppSpaceView } from '../../../../../../common/app-ui/AppSpaceView.tsx'
import { ChainIconView } from '../../../../../../common/app-ui/ChainIconView.tsx'
import { ComponentSize } from '../../../../../../common/app-ui/ComponentSize.ts'
import { LoadingView } from '../../../../../../common/app-ui/LoadingView.tsx'
import { ProfitValueContainer } from '../../../../../../common/app-ui/ProfitValueContainer.tsx'
import { TokenIconView } from '../../../../../../common/app-ui/TokenIconView.tsx'
import { StrategyStatusType } from '../../../../../../common/repository/data/model/StrategyResponse.ts'
import { SwapState } from '../../../../../../common/repository/data/model/SwapResponse.ts'
import { NumberShortener } from '../../../../../../utils/Shortener.ts'
import { StrategyHolderButtonIds } from '../../../../domain/StrategyHolderButtonIds.ts'
import { StrategyListItem } from '../../../model/StrategyListItem.ts'
import { StrategyStatusView } from './StrategyStatusView.tsx'

const CollapseArrowIconUp = styled(CollapseArrowIcon)`
`

const CollapseArrowIconDown = styled(CollapseArrowIcon)`
  rotate: 180deg;
`

const ArrowIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
`

const ArrowIconWrapper = styled(ArrowIcon)<{ angle: number }>`
  width: 20px;
  height: 20px;
  rotate: ${({angle}) => angle}deg;
`

const IconContainer = styled(m.div)`
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

const DeleteIconWrapper = styled(DeleteIcon)`
  width: 24px;
  height: 24px;
`

const PlayIconWrapper = styled(PlayIcon)`
  width: 24px;
  height: 24px;
`

const PauseIconWrapper = styled(PauseIcon)`
  width: 24px;
  height: 24px;
`

const ArchiveIconWrapper = styled(TrashBinIcon)`
  width: 24px;
  height: 24px;
`

const ExitIconWrapper = styled(ExitIcon)`
  width: 24px;
  height: 24px;
  rotate: 270deg;
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

const Container = styled(m.div)`
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
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid gray;
  padding-right: 8px;
  font-size: ${({theme}) => theme.size.fontSize.small};
`

const LogItemContainer = styled.div`
  display: flex;
  place-items: center;
`

const SwapContainer = styled.div`
  cursor: pointer;
  display: grid;
  padding: 4px 8px;
  grid-template-columns: 20px 1fr fit-content(100px);
  justify-content: center;
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

const TextUnderline = styled.span`
  text-decoration: underline;
  cursor: pointer;
`

const HeaderButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
  margin-top: 24px;
`

const InputWrapper = styled(AppNumberInputView)`
  width: 100px;
`

const AnalyticsButtonWrapper = styled(AppButton)`
  width: 40%;
  max-width: 145px;
  margin-top: 8px;
  font-size: ${({theme}) => theme.size.fontSize.small};
`

const YesNoColor = styled.span<{ $isYes: boolean }>`
  color: ${({theme, $isYes}) => $isYes ? theme.color.common.green : theme.color.common.orange}
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
  buyMaxPrice?: number,
  stopLossPercents?: number,
}

export interface ScalpelClassicStrategyHolderProps {
  item: StrategyListItem<ScalpelClassicStrategyOptions>
  onItemClick: (viewId: number, hash: string, data?: unknown) => void
}

export const ScalpelClassicStrategyHolderView = memo(
  forwardRef((
    {item, onItemClick}: ScalpelClassicStrategyHolderProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {

    const [isMoreInfo, setIsMoreInfo] = useState(false)
    const [editGasPrice, setEditGasPrice] = useState(false)
    const [editGrowPercent, setEditGrowPercent] = useState(false)
    const [editFallPercent, setEditFallPercent] = useState(false)
    const [editMaxTokenPrice, setEditMaxTokenPrice] = useState(false)
    const [editStopLossPercent, setEditStopLossPercent] = useState(false)

    const [maxGasPrice, setMaxGasPrice] = useState<number>(item.gasLimit)
    const [growPercent, setGrowPercent] = useState<number>(
      (item.options.growDiffPercentsUp ?? item.options.growDiffPercents ?? 0)
    )
    const [fallPercent, setFallPercent] = useState<number>(
      (item.options.growDiffPercentsDown ?? item.options.growDiffPercents ?? 0)
    )
    const [maxBuyPriceCoin, setMaxBuyPriceCoin] = useState<number | undefined>(item.options.buyMaxPrice)
    const [stopLossPercents, setStopLossPercents] = useState<number | undefined>(item.options.stopLossPercents)

    useEffect(() => {
      setMaxGasPrice(item.gasLimit)
      setGrowPercent((item.options.growDiffPercentsUp ?? item.options.growDiffPercents ?? 0))
      setFallPercent((item.options.growDiffPercentsDown ?? item.options.growDiffPercents ?? 0))
      setMaxBuyPriceCoin(item.options.buyMaxPrice)
      setStopLossPercents(item.options.stopLossPercents)

    }, [item.options, item.gasLimit])

    const getIconPlayPause = useMemo(() => {
      if (PlayStatus.has(item.status)) {
        return <PlayIconWrapper />

      } else if (PauseStatus.has(item.status)) {
        return <PauseIconWrapper />
      }
      return undefined
    }, [item.status])

    const getActionButtons = useCallback(
      () => {
        return (
          <ActionButtonsContainer>
          {
            item.status === StrategyStatusType.CANCELED && (
              <AppIconButton
                onClick={() => {
                  onItemClick(StrategyHolderButtonIds.DELETE_ORDER_BUTTON_ID, item.hash)
                }}
                icon={<DeleteIconWrapper />}
                size={ComponentSize.STANDARD}
              />
            )
          }
            {
              item.status !== StrategyStatusType.CANCELED && (
                <AppIconButton
                  disabled={item.waitChangeStatusCancel}
                  onClick={() => {
                    onItemClick(StrategyHolderButtonIds.CANCEL_ORDER_BUTTON_ID, item.hash)
                  }}
                  icon={item.waitChangeStatusCancel ? <LoadingView size={ComponentSize.SMALL} /> : <ArchiveIconWrapper />}
                  size={ComponentSize.STANDARD}
                />
              )
            }

            {
              item.status !== StrategyStatusType.CANCELED &&
              item.status !== StrategyStatusType.APPROVE_IN_PROGRESS &&
              item.status !== StrategyStatusType.CREATED
                ? (
                  <AppIconButton
                    disabled={item.waitForceExecute}
                    onClick={() => {onItemClick(StrategyHolderButtonIds.FORCE_EXECUTE_ORDER_BUTTON_ID, item.hash)}}
                    icon={item.waitForceExecute ? <LoadingView size={ComponentSize.SMALL} /> : <ExitIconWrapper />}
                    size={ComponentSize.STANDARD}
                  />
                )
                : undefined
            }

            {
              getIconPlayPause && (
                <AppIconButton
                  disabled={item.waitChangeStatusPlayPause}
                  onClick={() => {
                    if (PlayStatus.has(item.status)) {
                      onItemClick(StrategyHolderButtonIds.PLAY_ORDER_BUTTON_ID, item.hash)

                    } else if (PauseStatus.has(item.status)) {
                      onItemClick(StrategyHolderButtonIds.PAUSE_ORDER_BUTTON_ID, item.hash)
                    }
                  }}
                  icon={item.waitChangeStatusPlayPause ? <LoadingView size={ComponentSize.SMALL} /> : getIconPlayPause}
                  size={ComponentSize.STANDARD}
                />
              )
            }
      </ActionButtonsContainer>
        )
      },
      [
        item.hash,
        item.waitForceExecute,
        getIconPlayPause,
        item.status,
        item.waitChangeStatusCancel,
        item.waitChangeStatusPlayPause,
        onItemClick
      ]
    )

    const getFullView = useCallback(
      () => {
        return (
          <>
        <AppSpaceView />
        <ElementContainer>Strategy: {item.type}</ElementContainer>
        <ElementContainer>Wallet:&nbsp;<AppAddressView address={item.wallet} /></ElementContainer>
        <ElementContainer>
          Transfer approved:&nbsp;
          {item.currencyA.symbol}&nbsp;
          (<YesNoColor $isYes={item.approvedA}>{item.approvedA ? 'Yes' : 'No'}</YesNoColor>)
          /&nbsp;
          {item.currencyB.symbol}&nbsp;
          (<YesNoColor $isYes={item.approvedB}>{item.approvedB ? 'Yes' : 'No'}</YesNoColor>)
        </ElementContainer>
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
                      onItemClick(StrategyHolderButtonIds.CHANGE_GAS_PRICE_BUTTON_ID, item.hash, maxGasPrice)
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
          Take profit:&nbsp;
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
                      onItemClick(StrategyHolderButtonIds.CHANGE_GROW_PERCENT_BUTTON_ID, item.hash, growPercent)
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
          Falling:&nbsp;
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
                      onItemClick(StrategyHolderButtonIds.CHANGE_FALL_PERCENT_BUTTON_ID, item.hash, fallPercent)
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
            Stop-loss:&nbsp;
            {
              editStopLossPercent
                ? (
                  <>
                  <InputWrapper
                    allowNegative={false}
                    decimals={2}
                    max={100}
                    min={0}
                    allowEmptyValue={true}
                    defaultValue={stopLossPercents}
                    suffix={'%'}
                    onChange={(v) => setStopLossPercents(v)}
                  />

                  <ButtonContainer
                    onClick={() => {
                      onItemClick(
                        StrategyHolderButtonIds.CHANGE_STOP_LOSS_PERCENT_BUTTON_ID,
                        item.hash,
                        stopLossPercents ?? null
                      )
                      setEditStopLossPercent(false)
                    }}
                    whileTap={{scale: 0.95}}
                  >
                    <SaveIconWrapper />
                  </ButtonContainer>
                </>
                )
                : (
                  <>
                    {stopLossPercents !== undefined ? `${stopLossPercents}%` : '-'}&nbsp;
                    <ButtonContainer
                      onClick={() => setEditStopLossPercent(true)}
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
                      onItemClick(
                        StrategyHolderButtonIds.CHANGE_TOKEN_B_PRICE_BUTTON_ID,
                        item.hash,
                        maxBuyPriceCoin ?? null
                      )
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
                  {maxBuyPriceCoin !== undefined ? `${maxBuyPriceCoin}` : '-'} &nbsp;
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
        stopLossPercents,
        editStopLossPercent,
      ]
    )

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
      <LazyMotion features={domAnimation} strict>
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
              <StableCoinContainer
                $highlight={(item.totalAmountA > 0) ||
                  false}
              >{item.totalAmountA}</StableCoinContainer>
              &nbsp;/&nbsp;
              {item.totalAmountB}
          </ElementContainer>
          </div>
          <div>
            <HeaderButtonContainer>
              <AppIconButton
                icon={isMoreInfo ? <CollapseArrowIconUp /> : <CollapseArrowIconDown />}
                onClick={() => setIsMoreInfo(!isMoreInfo)}
                size={ComponentSize.SMALL}
              />
            </HeaderButtonContainer>
          </div>
        </ContainerHeader>

        <ElementContainer>
          Status:&nbsp;<StrategyStatusView status={item.status} />
        </ElementContainer>

        <ElementContainer>
          {item.currencyB.symbol} Price: ${item.currencyBUsdPrice ?? '-'}
        </ElementContainer>

          {
            item.adaptiveUsdPrice && (
              <ElementContainer>
              Exchange adaptive price: ${item.adaptiveUsdPrice}
            </ElementContainer>
            )
          }

          <ElementContainer>
          Usd amount:&nbsp;
            <ProfitValueContainer
              $value={(item.totalUsdAmountB > 0 ? item.totalUsdAmountB : item.totalAmountA) - item.initialAmountA}
            >
            ${item.totalUsdAmountB > 0 ? item.totalUsdAmountB : item.totalAmountA}
            </ProfitValueContainer>
            &nbsp;/ ${item.initialAmountA}
        </ElementContainer>

        <ElementContainer>
          Current profit:&nbsp;
          <ProfitValueContainer
            $value={(item.totalUsdAmountB > 0 ? item.totalUsdAmountB : item.totalAmountA) -
              item.initialAmountA}
          >
           ${NumberShortener((item.totalUsdAmountB > 0 ? item.totalUsdAmountB : item.totalAmountA) -
            item.initialAmountA)}
          </ProfitValueContainer>
        </ElementContainer>

        <ElementContainer>
          Earned profit:&nbsp;
          <ProfitValueContainer $value={item.totalUsdProfit}>
            ${item.totalUsdProfit}
          </ProfitValueContainer>
        </ElementContainer>

        <AnalyticsButtonWrapper
          onClick={() => onItemClick(StrategyHolderButtonIds.OPEN_ANALYTICS_BUTTON_ID, item.hash)}
          size={ComponentSize.SMALL}
          text={'Analytics'}
        />

          {isMoreInfo ? getFullView() : undefined}
          {item.status ===
          StrategyStatusType.CANCELED ||
          item.status ===
          StrategyStatusType.PAUSED ||
          item.logs.length ===
          0
            ? undefined
            : (
              <SwapsLogsBlock onClick={() => onItemClick(StrategyHolderButtonIds.OPEN_LOGS_BUTTON_ID, item.hash)}>
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
            )
          }

          {item.swaps.length === 0
            ? undefined
            : (
              <SwapsLogsBlock onClick={() => onItemClick(StrategyHolderButtonIds.OPEN_SWAP_BUTTON_ID, item.hash)}>
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
                    <span>
                      {swap.amountFrom} {swap.addressFrom === item.currencyB.address ? ` ($${swap.exchangeUsdPrice})`
                      : ''}
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
    </LazyMotion>
    )
  })
)
