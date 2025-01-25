import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import AddIcon from '../../../assets/icons/app/AddIcon.svg'
import { ComponentSize } from '../../../common/app-ui/ComponentSize.ts'
import { DialogCallback } from '../../../common/app-ui/dialog/BasicDialogView.tsx'
import { DialogAlertCallBack, DialogAlertView } from '../../../common/app-ui/dialog/DialogAlertView.tsx'
import { DialogQuestionCallBack, DialogQuestionView } from '../../../common/app-ui/dialog/DialogQuestionView.tsx'
import { FloatingActionButtonView } from '../../../common/app-ui/FloatingActionButtonView.tsx'
import { LoadingView } from '../../../common/app-ui/LoadingView.tsx'
import { PageHeaderView } from '../../../common/app-ui/PageHeaderView.tsx'
import { PageLayoutView } from '../../../common/app-ui/PageLayoutView.tsx'
import useObservable from '../../../hooks/useObservable.ts'
import { usePresenter } from '../../../hooks/usePresenter.ts'
import { getDIValue } from '../../../Injections.ts'
import { SimulationPageDialogProvider } from '../domain/router/SimulationPageDialogProvider.ts'
import { SimulationPagePresenter } from '../domain/SimulationPagePresenter.ts'
import '../domain/SimulationPagePresenterModule.ts'
import { DialogCreateStrategyView } from './components/DialogCreateStrategyView.tsx'
import { SimulationListView } from './components/list/SimulationListView.tsx'

const Container = styled(PageLayoutView)`
  overflow: hidden;
  height: 100vh;
`

const ListContainer = styled.div`
  overflow-y: auto;
  height: calc(100vh - ${({theme}) => theme.size.header});
`

export const SimulationPageView = () => {

  const presenter = usePresenter(SimulationPagePresenter)
  const dialogProvider = useMemo(() => getDIValue(SimulationPageDialogProvider), [])
  const listItems = useObservable(presenter.getItems(), [])
  const isLastPage = useObservable(presenter.getIsLastPage(), true)
  const isLoading = useObservable(presenter.getIsLoading(), true)
  const isLoadingFinished = useObservable(presenter.getLoadingFinished(), undefined)
  const [pullToRefreshLoading, setPullToRefreshLoading] = useState(false)
  const listContainerRef = useRef<HTMLDivElement | null>(null)
  const dialogCreateStrategyRef = useRef<DialogCallback<void> | null>(null)
  const dialogQuestionRef = useRef<DialogQuestionCallBack | null>(null)
  const dialogAlertRef = useRef<DialogAlertCallBack | null>(null)

  useLayoutEffect(() => {
    dialogProvider.setDialogCallback({
      openConfirmDeleteDialog(resultId: number | string, simulationId: number) {
        dialogQuestionRef.current?.openDialog({
          title: 'Delete',
          message: 'Are you sure you want to delete the simulation?',
          data: simulationId,
          dialogId: resultId,
        })
      },
      openCreateStrategyDialog() {
        dialogCreateStrategyRef.current?.openDialog()

      }, closeCreateSimulationDialog(): void {
        dialogCreateStrategyRef.current?.closeDialog()
        presenter.refresh()
      }, openWarnTooMuchInQueueDialog(): void {
        dialogAlertRef.current?.openDialog({
          title: 'Create simulation',
          message: 'The maximum number of simulations in the queue is 3. Wait for them to complete or delete previously created simulations.'
        })
      }, openWarnTooMuchSimulations(): void {
        dialogAlertRef.current?.openDialog({
          title: 'Create simulation',
          message: 'The maximum number of simulations is 10. To create new ones, delete previously created simulations.'
        })
      }

    })
    return () => dialogProvider.destory()
  }, [presenter, dialogProvider])

  useEffect(() => {
    if (isLoadingFinished) {
      setPullToRefreshLoading(false)
    }
  }, [isLoadingFinished])

  return (
    <div>
      <PageHeaderView text={'Simulations'} />

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
        <FloatingActionButtonView
          icon={<AddIcon />}
          onClick={() => presenter.onCreateNewSimulationClick()}
          scrollView={listContainerRef}
        />

        <DialogCreateStrategyView
          key={'dialog-create-strategy'}
          ref={dialogCreateStrategyRef}
          onCloseDialog={() => presenter.refresh()}
        />
        <DialogQuestionView
          onOkClick={(data: unknown, dialogId) => presenter.onActionResultCallback(data, dialogId)}
          ref={dialogQuestionRef}
        />
        <DialogAlertView ref={dialogAlertRef} />
      </Container>
    </div>
  )
}

export default SimulationPageView
