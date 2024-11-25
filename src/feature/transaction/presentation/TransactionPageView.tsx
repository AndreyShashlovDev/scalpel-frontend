import { useLayoutEffect, useMemo } from 'react'
import styled from 'styled-components'
import { ComponentSize } from '../../../common/app-ui/presentation/ComponentSize.ts'
import { LoadingView } from '../../../common/app-ui/presentation/LoadingView.tsx'
import { PageHeaderView } from '../../../common/app-ui/presentation/PageHeaderView.tsx'
import { PageLayoutView } from '../../../common/app-ui/presentation/PageLayoutView.tsx'
import useObservable from '../../../hooks/useObservable.ts'
import { getDIValue } from '../../../Injections.ts'
import { TransactionPagePresenter } from '../domain/TransactionPagePresenter.ts'
import { TransactionListView } from './components/wallet-list/TransactionListView.tsx'
import '../domain/TransactionPagePresenterModule.ts'

const Container = styled(PageLayoutView)`
  overflow: hidden;
  height: 100vh;
`

const ListContainer = styled.div`
  overflow-y: auto;
  height: calc(100vh - ${({theme}) => theme.size.header});
`

export interface LogsPageProps {
  strategyHash?: string
}

const TransactionPageView = ({strategyHash}: LogsPageProps) => {

  const presenter = useMemo(() => getDIValue(TransactionPagePresenter), [])
  const itemModels = useObservable(presenter.getTransactionItems(), [])
  const isLoading = useObservable(presenter.getIsLoading(), true)
  const isLastPage = useObservable(presenter.getIsLastPage(), false)

  useLayoutEffect(() => {
    presenter.init()

    return () => presenter.destroy()
  }, [strategyHash, presenter])

  return (
    <div>
      <PageHeaderView text={'Transactions:'} />
      <Container
        refresh={() => presenter.refresh()}
        fetched={!isLoading}
      >
        {
          (isLoading) ? <LoadingView size={ComponentSize.STANDARD} /> : undefined
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
