import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ComponentSize } from '../../../common/app-ui/ComponentSize.ts'
import { LoadingView } from '../../../common/app-ui/LoadingView.tsx'
import { PageHeaderView } from '../../../common/app-ui/PageHeaderView.tsx'
import { PageLayoutView } from '../../../common/app-ui/PageLayoutView.tsx'
import useObservable from '../../../utils/di-core/react/hook/useObservable.ts'
import { usePresenter } from '../../../utils/di-core/react/hook/usePresenter.ts'
import { TransactionPagePresenter } from '../domain/TransactionPagePresenter.ts'
import { TransactionListView } from './components/wallet-list/TransactionListView.tsx'

const Container = styled(PageLayoutView)`
  overflow: hidden;
  height: 100vh;
`

const ListContainer = styled.div`
  overflow-y: auto;
  height: calc(100vh - ${({theme}) => theme.size.header});
`

const TransactionPageView = () => {

  const presenter = usePresenter(TransactionPagePresenter)
  const itemModels = useObservable(presenter.getTransactionItems(), [])
  const isLoading = useObservable(presenter.getIsLoading(), true)
  const isLastPage = useObservable(presenter.getIsLastPage(), false)
  const isLoadingFinished = useObservable(presenter.getLoadingFinished(), undefined)
  const [pullToRefreshLoading, setPullToRefreshLoading] = useState(false)

  useEffect(() => {
    if (isLoadingFinished) {
      setPullToRefreshLoading(false)
    }
  }, [isLoadingFinished])

  return (
    <div>
      <PageHeaderView text={'Transactions'} />
      <Container
        refresh={() => {
          setPullToRefreshLoading(true)
          presenter.refresh()
        }}
        fetched={!isLoading}
      >
        {
          (isLoading && !pullToRefreshLoading) ? <LoadingView size={ComponentSize.STANDARD} /> : undefined
        }
        {
          (!isLoading && itemModels.length === 0)
            ? <div>List is empty</div>
            : (
              <ListContainer>
                <TransactionListView
                  hasNext={!isLastPage}
                  onNextFetch={() => presenter.fetchNext()}
                  items={itemModels}
                />
              </ListContainer>
            )
        }
      </Container>
    </div>
  )
}

export default TransactionPageView
