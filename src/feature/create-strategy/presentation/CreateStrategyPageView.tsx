import { useCallback, useLayoutEffect, useMemo } from 'react'
import styled from 'styled-components'
import { AppButton } from '../../../common/app-ui/presentation/AppButton.tsx'
import { AppComboBoxView } from '../../../common/app-ui/presentation/AppComboBoxView.tsx'
import { ComponentSize } from '../../../common/app-ui/presentation/ComponentSize.ts'
import { LoadingView } from '../../../common/app-ui/presentation/LoadingView.tsx'
import { PageHeaderView } from '../../../common/app-ui/presentation/PageHeaderView.tsx'
import { PageLayoutView } from '../../../common/app-ui/presentation/PageLayoutView.tsx'
import { StrategyType } from '../../../common/repository/data/model/StrategyType.ts'
import useObservable from '../../../hooks/useObservable.ts'
import { getDIValue } from '../../../Injections.ts'
import { CreateStrategyPagePresenter } from '../domain/CreateStrategyPagePresenter.ts'
import { State } from '../domain/CreateStrategyPagePresenterImpl.ts'
import '../domain/CreateStrategyPagePresenterModule.ts'
import { ClassicScalpelOptionsView } from './components/strategy-options/ClassicScalpelOptionsView.tsx'

const Container = styled(PageLayoutView)`
  height: 100vh;
  display: grid;
  grid-template-rows: 48px 1fr 80px;
`

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const ButtonNextContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  overflow: hidden;
`
const TitleContainer = styled.div`
  font-size: ${({theme}) => theme.size.fontSize.medium};
  padding-bottom: 8px;
`

const CreateStrategyPageView = () => {

  const presenter = useMemo(() => getDIValue(CreateStrategyPagePresenter), [])
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

  useLayoutEffect(() => {
    presenter.init()

    return () => presenter.destroy()
  }, [presenter])

  const getChooseChain = useCallback(() => {
    return (
      <div>
        <TitleContainer>Please choose Chain</TitleContainer>
        <div>
          <AppComboBoxView
            defaultSelection={selectedChain?.toString() ?? 'Select chain...'}
            items={availableChains}
            onSelect={(item => presenter.onSelectChain(item))}
          /></div>
      </div>
    )
  }, [selectedChain, presenter, availableChains])

  const getChooseCoin = useCallback(() => {
    return (
      <>
      {
        canShowLoading
          ? <LoadingView size={ComponentSize.LARGEST} />
          : (
            <div>
              <TitleContainer>Please choose coin</TitleContainer>
              <div>
                <AppComboBoxView
                  defaultSelection={selectedTokenB?.address ?? 'Select coin...'}
                  items={availableCoins}
                  onSelect={(item => presenter.onSelectCoinB(item))}
                />
              </div>
            </div>
          )
      }
    </>
    )
  }, [presenter, selectedTokenB, availableCoins, canShowLoading])

  const getChooseWallet = useCallback(() => {
    return (
      <>
      {
        canShowLoading
          ? <LoadingView size={ComponentSize.LARGEST} />
          : (
            <div>
              <TitleContainer>Please choose wallet</TitleContainer>
               <AppComboBoxView
                 defaultSelection={selectedWallet ?? 'Select wallet...'}
                 items={availableWallets}
                 onSelect={(item => presenter.onSelectWallet(item))}
               />

              {
                availableWallets.length === 0 && (
                  <div>
                    <div>
                       It looks like you don't have any wallets. Please create a wallet.
                    </div>
                    <div>
                      <AppButton onClick={() => presenter.onCreateWalletClick()} text={'Create wallet'} />
                    </div>
                  </div>
                )
              }
            </div>
          )
      }
    </>
    )
  }, [presenter, selectedWallet, availableWallets, canShowLoading])

  const getChooseOptions = useCallback(() => {
    if (selectedStrategy === StrategyType.CLASSIC_SCALPEL && selectedTokenA && selectedTokenB && selectedWallet) {
      return <ClassicScalpelOptionsView
        tokenA={selectedTokenA}
        tokenB={selectedTokenB}
        wallet={selectedWallet}
        onChange={(data, isFullFilled) => presenter.onChangeOptions(data, isFullFilled)}
      />
    }
  }, [presenter, selectedTokenA, selectedTokenB, selectedWallet, selectedStrategy])

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
    <Container>
      <PageHeaderView text={'Create strategy'} />
      <ContentContainer>
        {getViewByState()}
      </ContentContainer>

      <ButtonNextContainer>
        <AppButton
          onClick={() => presenter.onClickNext()}
          text={state === State.OPTIONS ? 'Create' : 'Next'}
          disabled={!isCanNext}
        />
      </ButtonNextContainer>
    </Container>
  )
}

export default CreateStrategyPageView
