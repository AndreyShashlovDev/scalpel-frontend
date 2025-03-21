import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ComponentSize } from '../../../common/app-ui/ComponentSize.ts'
import { DialogQuestionCallBack, DialogQuestionView } from '../../../common/app-ui/dialog/DialogQuestionView.tsx'
import { LoadingView } from '../../../common/app-ui/LoadingView.tsx'
import { PageHeaderView } from '../../../common/app-ui/PageHeaderView.tsx'
import { PageLayoutView } from '../../../common/app-ui/PageLayoutView.tsx'
import useObservable from '../../../utils/di-core/react/hook/useObservable.ts'
import { useInject } from '../../../utils/di-core/react/hook/useInject.ts'
import { usePresenter } from '../../../utils/di-core/react/hook/usePresenter.ts'
import { WalletPagePresenter } from '../domain/WalletPagePresenter.ts'
import { WalletPageDialogProvider } from '../router/WalletPageDialogProvider.ts'
import { WalletListView } from './components/wallet-list/WalletListView.tsx'

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
  const dialogProvider = useInject(WalletPageDialogProvider)

  const walletItemsList = useObservable(presenter.getWalletItems(), [])
  const isLoading = useObservable(presenter.getIsLoading(), true)
  const isLastPage = useObservable(presenter.getIsLastPage(), true)
  const isLoadingFinished = useObservable(presenter.getLoadingFinished(), undefined)
  const [pullToRefreshLoading, setPullToRefreshLoading] = useState(false)
  const dialogQuestionRef = useRef<DialogQuestionCallBack | null>(null)

  useLayoutEffect(() => {
    dialogProvider.setDialogCallback({
      openQuestionDialog(title: string, message: string, data: unknown, resultId: number): void {
        dialogQuestionRef.current?.openDialog({
          title,
          message,
          data,
          dialogId: resultId
        })
      }
    })

    return () => {
      dialogProvider.destroy()
    }
  }, [dialogProvider])

  useEffect(() => {
    if (isLoadingFinished) {
      setPullToRefreshLoading(false)
    }
  }, [isLoadingFinished])

  const handleDialogResult = useCallback((data: unknown, dialogId: string | number) => {
    presenter.onActionResultCallback(data, dialogId)
  }, [presenter])

  return (
    <>
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
      <DialogQuestionView
        onOkClick={handleDialogResult}
        ref={dialogQuestionRef}
      />
    </>
  )
}

export default WalletPageView
