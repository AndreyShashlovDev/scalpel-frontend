import { useLayoutEffect, useMemo } from 'react'
import styled from 'styled-components'
import { LoadingView } from '../../../common/app-ui/presentation/LoadingView.tsx'
import { ChainType } from '../../../common/repository/data/model/ChainType.ts'
import useObservable from '../../../hooks/useObservable.ts'
import { getDIValue } from '../../../Injections.ts'
import { SwapPagePresenter } from '../domain/SwapPagePresenter.ts'
import { StrategyListView } from './components/swap-list/SwapListView.tsx'
import '../domain/SwapPagePresenterModule.ts'

const Container = styled.div`
  overflow: hidden;
  height: 100vh;
  background: ${({theme}) => theme.color.background};
`

const ListContainer = styled.div`
  overflow-y: auto;
  height: calc(100vh - ${({theme}) => theme.size.header});
`

export interface SwapPageProps {
  strategyHash?: string
  chain?: ChainType
}

export const SwapPageView = ({strategyHash, chain}: SwapPageProps) => {

  const presenter = useMemo(() => getDIValue(SwapPagePresenter), [])
  const swapItemsList = useObservable(presenter.getSwapItems(), [])
  const isLastPage = useObservable(presenter.getIsLastPage(), false)

  useLayoutEffect(() => {
    if (strategyHash && chain) {
      presenter.setupSwapData(strategyHash, chain)
    }

    presenter.init()

    return () => presenter.destroy()
  }, [strategyHash, chain, presenter])

  return (
    <Container>
      {
        isLastPage && (swapItemsList?.length ?? 0) === 0
          ? 'List empty'
          : (swapItemsList?.length ?? 0) === 0 && <LoadingView />
      }

      <ListContainer>
        <StrategyListView
          items={swapItemsList}
          onNextFetch={() => presenter.onFetchNext()}
          hasNext={!isLastPage}
        />
      </ListContainer>
    </Container>
  )
}
