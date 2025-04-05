import { useObservable, usePresenter } from 'flexdi/react'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ComponentSize } from '../../../common/app-ui/ComponentSize.ts'
import { LoadingView } from '../../../common/app-ui/LoadingView.tsx'
import { PageHeaderView } from '../../../common/app-ui/PageHeaderView.tsx'
import { PageLayoutView } from '../../../common/app-ui/PageLayoutView.tsx'
import { RouterPath } from '../../../common/router/domain/ApplicationRouter.ts'
import { SwapPagePresenter } from '../domain/SwapPagePresenter.ts'
import { StrategyListView } from './components/swap-list/SwapListView.tsx'

const Container = styled(PageLayoutView)`
  overflow: hidden;
  height: 100vh;
`

const ListContainer = styled.div`
  overflow-y: auto;
  height: calc(100vh - ${({theme}) => theme.size.header});
`

const SwapPageView = () => {

  const queryParams = useParams()
  const presenter = usePresenter(
    SwapPagePresenter,
    {strategyHash: queryParams[RouterPath.OrderSwaps.params.strategyHash] ?? ''}
  )

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

  const onBackButtonHandler = useCallback(() => {
    presenter.onBackButtonClick()
  }, [presenter])

  return (
    <>
      <PageHeaderView text={'Swaps'} hasMainMenu={false} hasBackButton={true} onBackButtonClick={onBackButtonHandler} />
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
   </>
  )
}

export default SwapPageView
