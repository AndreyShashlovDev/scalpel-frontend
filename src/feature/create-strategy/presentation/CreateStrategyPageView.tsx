import { useCallback } from 'react'
import styled from 'styled-components'
import PlayIcon from '../../../assets/icons/app/PlayIcon.svg'
import { AppAddressView } from '../../../common/app-ui/AppAddressView.tsx'
import { AppButton } from '../../../common/app-ui/AppButton.tsx'
import { AppComboBoxView } from '../../../common/app-ui/AppComboBoxView.tsx'
import { AppSpaceView } from '../../../common/app-ui/AppSpaceView.tsx'
import { ComponentSize } from '../../../common/app-ui/ComponentSize.ts'
import { LoadingView } from '../../../common/app-ui/LoadingView.tsx'
import { PageHeaderView } from '../../../common/app-ui/PageHeaderView.tsx'
import { PageLayoutView } from '../../../common/app-ui/PageLayoutView.tsx'
import { StrategyType } from '../../../common/repository/data/model/StrategyType.ts'
import useObservable from '../../../hooks/useObservable.ts'
import { usePresenter } from '../../../hooks/usePresenter.ts'
import { CreateStrategyPagePresenter } from '../domain/CreateStrategyPagePresenter.ts'
import { State } from '../domain/CreateStrategyPagePresenterImpl.ts'
import { ClassicScalpelOptionsView } from './components/strategy-options/ClassicScalpelOptionsView.tsx'
import '../domain/CreateStrategyPagePresenterModule.ts'

const PlayIconWrapper = styled(PlayIcon)`
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
`

const Wrapper = styled.div`
  height: 100%;
`

const Container = styled(PageLayoutView)`
  overflow-y: hidden;
  height: 100%;
`

const ScrollPageContainer = styled.div`
  overflow-y: auto;
  display: grid;
  grid-template-rows: 0.9fr 100px;
  height: 100%;
  padding-bottom: 32px;
`

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ButtonNextContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  overflow: hidden;
  margin-top: 16px;
`

const TitleContainer = styled.div`
  font-size: ${({theme}) => theme.size.fontSize.medium};
  padding-bottom: 8px;
  text-align: center;
`

const SubTitleContainer = styled.div`
  font-size: ${({theme}) => theme.size.fontSize.small};
  padding-bottom: 8px;
  text-align: center;
`

const InfoBlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`
const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  max-width: 100%;
`

const DescContainer = styled.div`
  width: 80%;
  max-width: 80%;
`

const OrangeColor = styled.span`
  color: ${({theme}) => theme.color.common.orange};
`
const CreateStrategyPageView = () => {

  const presenter = usePresenter(CreateStrategyPagePresenter)
  const state = useObservable(presenter.getCurrentState(), State.CHAIN)
  const isCanNext = useObservable(presenter.isCanNext(), false)
  const canShowLoading = useObservable(presenter.isCanShowLoading(), true)
  const availableChains = useObservable(presenter.getAvailableChains(), [])
  const availableCoins = useObservable(presenter.getAvailableCoins(), [])
  const availableWallets = useObservable(presenter.getAvailableWallets(), [])

  const selectedStrategy = useObservable(presenter.getSelectedStrategy(), undefined)
  const selectedChain = useObservable(presenter.getSelectedChain(), undefined)
  const selectedTokenA = useObservable(presenter.getSelectedTokenA(), undefined)
  const selectedTokenB = useObservable(presenter.getSelectedTokenB(), undefined)
  const selectedWallet = useObservable(presenter.getSelectedWallet(), undefined)
  const isCreateIsLoading = useObservable(presenter.getShowCreateLoading(), false)

  const descBodyView = useCallback(() => {
    const items = () => {
      if (state === State.CHAIN) {
        return (
          <div>Strategy: Classic Scalpel</div>
        )
      } else if (state === State.COIN) {
        return (
          <>
            <div>Strategy: Classic Scalpel</div>
            <div>Chain: {selectedChain}</div>
          </>
        )
      } else if (state === State.WALLET) {
        return (
          <>
            <div>Strategy: Classic Scalpel</div>
            <div>Chain: {selectedChain}</div>
            <div>Token A: {selectedTokenA?.symbol}</div>
            <div>Token B: {selectedTokenB?.symbol}</div>
          </>
        )
      } else if (state === State.OPTIONS) {
        return (
          <>
            <div>Strategy: Classic Scalpel</div>
            <div>Chain: {selectedChain}</div>
            <div>Token A: {selectedTokenA?.symbol}</div>
            <div>Token B: {selectedTokenB?.symbol}</div>
            <div>Wallet: <AppAddressView address={selectedWallet!} /></div>
          </>
        )
      }
    }
    return (
      <InfoBlockContainer>
        <AppSpaceView />
        <TitleContainer>Order: </TitleContainer>
        {items()}
        <AppSpaceView />
        <AppSpaceView />
      </InfoBlockContainer>
    )
  }, [selectedChain, selectedWallet, selectedTokenA, selectedTokenB, state])

  const getChooseChain = useCallback(() => {
    return (
      <BodyContainer>
        {descBodyView()}

        <TitleContainer>Please choose Chain</TitleContainer>
        <BodyContainer>
          <AppComboBoxView
            title={'Select chain...'}
            selectedItem={selectedChain?.toString()}
            items={availableChains}
            onSelect={(item => presenter.onSelectChain(item))}
          />
        </BodyContainer>
      </BodyContainer>
    )
  }, [descBodyView, selectedChain, presenter, availableChains])

  const getChooseCoin = useCallback(() => {
    return (
      <>
      {
        canShowLoading
          ? <LoadingView size={ComponentSize.LARGEST} />
          : (
            <BodyContainer>
              {descBodyView()}

              <TitleContainer>Please choose coin</TitleContainer>
              <BodyContainer>
                <AppComboBoxView
                  title={'Select coin...'}
                  selectedItem={selectedTokenB?.symbol}
                  items={availableCoins}
                  onSelect={(item => presenter.onSelectCoinB(item))}
                />
              </BodyContainer>
            </BodyContainer>
          )
      }
    </>
    )
  }, [descBodyView, presenter, selectedTokenB, availableCoins, canShowLoading])

  const getChooseWallet = useCallback(() => {
    return (
      <>
      {
        canShowLoading
          ? <LoadingView size={ComponentSize.LARGEST} />
          : (
            <BodyContainer>
             {descBodyView()}

              <TitleContainer>Please choose wallet</TitleContainer>
              <BodyContainer>
                <AppComboBoxView
                  title={'Select wallet...'}
                  selectedItem={selectedWallet}
                  items={availableWallets}
                  onSelect={(item => presenter.onSelectWallet(item))}
                />

                {
                  availableWallets.length === 0 &&
                  (
                    <>
                      <SubTitleContainer>
                         It looks like you don't have any wallets. Please create a wallet.
                      </SubTitleContainer>

                      <AppButton onClick={() => presenter.onCreateWalletClick()} text={'Create wallet'} />
                    </>
                  )
                }
              </BodyContainer>
            </BodyContainer>
          )
      }
    </>
    )
  }, [presenter, descBodyView, selectedWallet, availableWallets, canShowLoading])

  const getChooseOptions = useCallback(() => {
    const optionsView = () => {
      if (selectedStrategy ===
        StrategyType.CLASSIC_SCALPEL &&
        selectedTokenA &&
        selectedTokenB &&
        selectedWallet &&
        selectedChain
      ) {
        return <ClassicScalpelOptionsView
          tokenA={selectedTokenA}
          tokenB={selectedTokenB}
          wallet={selectedWallet}
          chain={selectedChain}
          onChange={(data, isFullFilled) => presenter.onChangeOptions(data, isFullFilled)}
        />
      }
    }

    return (
      <BodyContainer>
        {descBodyView()}
        <TitleContainer>Configuration of current strategy:</TitleContainer>
        {optionsView()}
        <DescContainer>
          Initially the order will be in the <OrangeColor>'Created'</OrangeColor> status. After all balances are completed, start it by clicking&nbsp;<PlayIconWrapper />
        </DescContainer>
      </BodyContainer>
    )
  }, [presenter, selectedChain, descBodyView, selectedTokenA, selectedTokenB, selectedWallet, selectedStrategy])

  const getViewByState = () => {
    if (state === State.CHAIN) {
      return getChooseChain()

    } else if (state === State.COIN) {
      return getChooseCoin()

    } else if (state === State.WALLET) {
      return getChooseWallet()

    } else if (state === State.OPTIONS) {
      return getChooseOptions()
    }

    return getChooseChain()
  }

  return (
    <Wrapper>
      <PageHeaderView text={'Create strategy'} />
      <Container>
        <ScrollPageContainer>
            <ContentContainer>
              {getViewByState()}
            </ContentContainer>

            <ButtonNextContainer>
              <AppButton
                onClick={() => presenter.onClickNext()}
                text={state === State.OPTIONS
                  ? (isCreateIsLoading ? <LoadingView size={ComponentSize.SMALL} /> : 'Create')
                  : 'Next'
                }
                disabled={!isCanNext || isCreateIsLoading}
              />
            </ButtonNextContainer>
            <AppSpaceView />
        </ScrollPageContainer>
      </Container>
    </Wrapper>
  )
}

export default CreateStrategyPageView
