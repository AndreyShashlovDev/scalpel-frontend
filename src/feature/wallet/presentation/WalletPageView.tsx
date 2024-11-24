import { useLayoutEffect, useMemo } from 'react'
import styled from 'styled-components'
import { ComponentSize } from '../../../common/app-ui/presentation/ComponentSize.ts'
import { LoadingView } from '../../../common/app-ui/presentation/LoadingView.tsx'
import { PageHeaderView } from '../../../common/app-ui/presentation/PageHeaderView.tsx'
import { PageLayoutView } from '../../../common/app-ui/presentation/PageLayoutView.tsx'
import useObservable from '../../../hooks/useObservable.ts'
import { getDIValue } from '../../../Injections.ts'
import { WalletPagePresenter } from '../domain/WalletPagePresenter.ts'
import { WalletListView } from './components/wallet-list/WalletListView.tsx'
import '../domain/WalletPagePresenterModule.ts'

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

const WalletPageView = ({strategyHash}: LogsPageProps) => {

  const presenter = useMemo(() => getDIValue(WalletPagePresenter), [])
  const walletItemsList = useObservable(presenter.getWalletItems(), [])
  const isLoading = useObservable(presenter.getIsLoading(), true)

  useLayoutEffect(() => {
    presenter.init()

    return () => presenter.destroy()
  }, [strategyHash, presenter])

  return (
    <div>
      <PageHeaderView text={'Wallets:'} />
      <Container
        refresh={() => presenter.refresh()}
        fetched={!isLoading}
      >
        {
          (isLoading) ? <LoadingView size={ComponentSize.STANDARD} /> : undefined
        }
        {
          (!isLoading && walletItemsList.length === 0)
            ? <div>List is empty</div>
            : (
              <ListContainer>
                <WalletListView items={walletItemsList} />
              </ListContainer>
            )
        }
      </Container>
    </div>
  )
}

export default WalletPageView
