import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ComponentSize } from '../../../common/app-ui/ComponentSize.ts'
import { LoadingView } from '../../../common/app-ui/LoadingView.tsx'
import { PageLayoutView } from '../../../common/app-ui/PageLayoutView.tsx'
import useObservable from '../../../hooks/useObservable.ts'
import { usePresenter } from '../../../hooks/usePresenter.ts'
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

  const presenter = usePresenter(SwapPagePresenter, {strategyHash})
  const swapItemsList = useObservable(presenter.getSwapItems(), [])
  const isLastPage = useObservable(presenter.getIsLastPage(), true)
  const isLoading = useObservable(presenter.getIsLoading(), true)
  const isLoadingFinished = useObservable(presenter.getLoadingFinished(), undefined)
  const [pullToRefreshLoading, setPullToRefreshLoading] = useState(false)

  useEffect(() => {
    if (isLoadingFinished) {
      setPullToRefreshLoading(false)
    }
  }, [isLoadingFinished])

  return (
    <Container
      fetched={!isLoading}
      refresh={() => {
        setPullToRefreshLoading(true)
        presenter.refresh()
      }}
    >
      {
        (isLoading && !pullToRefreshLoading) ? <LoadingView size={ComponentSize.STANDARD} /> : undefined
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
