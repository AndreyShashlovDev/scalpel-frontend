import { useLayoutEffect, useMemo } from 'react'
import styled from 'styled-components'
import { ComponentSize } from '../../../common/app-ui/presentation/ComponentSize.ts'
import { LoadingView } from '../../../common/app-ui/presentation/LoadingView.tsx'
import { PageLayoutView } from '../../../common/app-ui/presentation/PageLayoutView.tsx'
import useObservable from '../../../hooks/useObservable.ts'
import { getDIValue } from '../../../Injections.ts'
import { SwapPagePresenter } from '../domain/SwapPagePresenter.ts'
import { StrategyListView } from './components/swap-list/SwapListView.tsx'
import '../domain/SwapPagePresenterModule.ts'

const Container = styled(PageLayoutView)`
  overflow: hidden;
  height: 100vh;
`

const ListContainer = styled.div`
  overflow-y: auto;
  height: calc(100vh - ${({theme}) => theme.size.header});
`

export interface SwapPageProps {
  strategyHash?: string
}

export const SwapPageView = ({strategyHash}: SwapPageProps) => {

  const presenter = useMemo(() => getDIValue(SwapPagePresenter), [])
  const swapItemsList = useObservable(presenter.getSwapItems(), [])
  const isLastPage = useObservable(presenter.getIsLastPage(), true)
  const isLoading = useObservable(presenter.getIsLoading(), true)

  useLayoutEffect(() => {
    if (strategyHash) {
      presenter.setupSwapData(strategyHash)
    }

    presenter.init()

    return () => presenter.destroy()
  }, [strategyHash, presenter])

  return (
    <Container
      refresh={() => presenter.refresh()}
      fetched={!isLoading}
    >
      {
        (isLoading && isLastPage) ? <LoadingView size={ComponentSize.STANDARD} /> : undefined
      }
      {
        (!isLoading && swapItemsList.length === 0)
          ? <div>List is empty</div>
          : (
            <ListContainer>
              <StrategyListView
                items={swapItemsList}
                onNextFetch={() => presenter.onFetchNext()}
                hasNext={!isLastPage}
              />
            </ListContainer>
          )
      }
    </Container>
  )
}
