import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ComponentSize } from '../../../common/app-ui/ComponentSize.ts'
import { LoadingView } from '../../../common/app-ui/LoadingView.tsx'
import { PageHeaderView } from '../../../common/app-ui/PageHeaderView.tsx'
import { PageLayoutView } from '../../../common/app-ui/PageLayoutView.tsx'
import useObservable from '../../../utils/di-core/react/hook/useObservable.ts'
import { usePresenter } from '../../../utils/di-core/react/hook/usePresenter.ts'
import { DemoPagePresenter } from '../domain/DemoPagePresenter.ts'
import { SimulationListView } from './components/list/SimulationListView.tsx'

const Container = styled(PageLayoutView)`
  overflow: hidden;
  height: 100vh;
`

const ListContainer = styled.div`
  overflow-y: auto;
  height: calc(100vh - ${({theme}) => theme.size.header});
`

export const DemoPageView = () => {

  const presenter = usePresenter(DemoPagePresenter)
  const listItems = useObservable(presenter.getItems(), [])
  const isLastPage = useObservable(presenter.getIsLastPage(), true)
  const isLoading = useObservable(presenter.getIsLoading(), true)
  const isLoadingFinished = useObservable(presenter.getLoadingFinished(), undefined)
  const [pullToRefreshLoading, setPullToRefreshLoading] = useState(false)
  const listContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isLoadingFinished) {
      setPullToRefreshLoading(false)
    }
  }, [isLoadingFinished])

  return (
    <div>
      <PageHeaderView
        text={'Demo'}
        hasMainMenu={false}
        hasBackButton={true}
        onBackButtonClick={() => presenter.onBackClick()}
      />

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
          (!isLoading && listItems.length === 0)
            ? <div>List is empty</div>
            : (
              <ListContainer ref={listContainerRef}>
                <SimulationListView
                  items={listItems}
                  onNextFetch={() => presenter.onFetchNext()}
                  hasNext={!isLastPage}
                  onItemClick={(hash, viewId, data) => presenter.onListItemClick(hash, viewId, data)}
                />
              </ListContainer>
            )
        }
      </Container>
    </div>
  )
}

export default DemoPageView
