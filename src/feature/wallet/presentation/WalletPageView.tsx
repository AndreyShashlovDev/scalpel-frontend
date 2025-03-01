import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ComponentSize } from '../../../common/app-ui/ComponentSize.ts'
import { LoadingView } from '../../../common/app-ui/LoadingView.tsx'
import { PageHeaderView } from '../../../common/app-ui/PageHeaderView.tsx'
import { PageLayoutView } from '../../../common/app-ui/PageLayoutView.tsx'
import useObservable from '../../../hooks/useObservable.ts'
import { usePresenter } from '../../../hooks/usePresenter.ts'
import { WalletPagePresenter } from '../domain/WalletPagePresenter.ts'
import { WalletListView } from './components/wallet-list/WalletListView.tsx'
import '../di/WalletPagePresenterModule.ts'

const Container = styled(PageLayoutView)`
  overflow: hidden;
  height: 100vh;
`

const ListContainer = styled.div`
  overflow-y: auto;
  height: calc(100vh - ${({theme}) => theme.size.header});
`

const WalletPageView = () => {

  const presenter = usePresenter(WalletPagePresenter)
  const walletItemsList = useObservable(presenter.getWalletItems(), [])
  const isLoading = useObservable(presenter.getIsLoading(), true)
  const isLastPage = useObservable(presenter.getIsLastPage(), true)
  const isLoadingFinished = useObservable(presenter.getLoadingFinished(), undefined)
  const [pullToRefreshLoading, setPullToRefreshLoading] = useState(false)

  useEffect(() => {
    if (isLoadingFinished) {
      setPullToRefreshLoading(false)
    }
  }, [isLoadingFinished])

  return (
    <div>
      <PageHeaderView text={'Wallets'} />
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
          (!isLoading && walletItemsList.length === 0)
            ? <div>List is empty</div>
            : (
              <ListContainer>
                <WalletListView
                  hasNext={!isLastPage}
                  onNextFetch={() => presenter.fetchNext()}
                  items={walletItemsList}
                  onItemClick={(hash, viewId, data) => presenter.onListItemClick(hash, viewId, data)}
                />
              </ListContainer>
            )
        }
      </Container>
    </div>
  )
}

export default WalletPageView
