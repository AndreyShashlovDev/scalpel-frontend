import { useLayoutEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { LoadingView } from '../../../common/app-ui/presentation/LoadingView.tsx'
import { PageHeaderView } from '../../../common/app-ui/presentation/PageHeaderView.tsx'
import { PageLayoutView } from '../../../common/app-ui/presentation/PageLayoutView.tsx'
import useObservable from '../../../hooks/useObservable.ts'
import { getDIValue } from '../../../Injections.ts'
import { StrategiesPagePresenter } from '../domain/StrategiesPagePresenter.ts'
import { StrategyDialogProvider } from '../domain/StrategyDialogProvider.ts'
import { DialogAnalyticsCallBack, DialogAnalyticsView } from './components/DialogAnalyticsView.tsx'
import { DialogDeleteCallBack, DialogDeleteView } from './components/DialogDeleteView.tsx'
import { DialogForceExecuteCallBack, DialogForceExecuteView } from './components/DialogForceExecuteView.tsx'
import { DialogLogsCallBack, DialogLogsView } from './components/DialogLogsView.tsx'
import { DialogSwapsCallBack, DialogSwapsView } from './components/DialogSwapsView.tsx'
import { StrategyListView } from './components/strategy-list/StrategyListView.tsx'
import '../domain/StrategiesPageModule.ts'

const PageLayoutWrapper = styled(PageLayoutView)`
`

const ListContainer = styled.div`
  overflow-y: auto;
  height: calc(100vh - ${({theme}) => theme.size.header});
  padding-bottom: ${({theme}) => theme.size.header};
`

export const StrategiesPageView = () => {

  const presenter = useMemo(() => getDIValue(StrategiesPagePresenter), [])
  const dialogProvider = useMemo(() => getDIValue(StrategyDialogProvider), [])
  const strategies = useObservable(presenter.getStrategiesList(), undefined)
  const isLastPage = useObservable(presenter.getIsLastPage(), true)
  const isLoading = useObservable(presenter.getIsLoading(), true)

  const dialogSwapsRef = useRef<DialogSwapsCallBack | null>(null)
  const dialogLogsRef = useRef<DialogLogsCallBack | null>(null)
  const dialogDeleteRef = useRef<DialogDeleteCallBack | null>(null)
  const dialogAnalyticsRef = useRef<DialogAnalyticsCallBack | null>(null)
  const dialogForceExecuteRef = useRef<DialogForceExecuteCallBack | null>(null)
  const listScrollContainerRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    presenter.init()

    dialogProvider.setDialogCallback({
      openSwapsDialog(strategyHash: string): void {
        dialogSwapsRef.current?.openDialog({strategyHash})
      },
      openLogsDialog(strategyHash: string): void {
        dialogLogsRef.current?.openDialog({strategyHash})
      },
      openDeleteDialog(strategyHash: string): void {
        dialogDeleteRef.current?.openDialog({strategyHash})
      },
      openAnalyticsDialog(strategyHash: string): void {
        dialogAnalyticsRef.current?.openDialog({strategyHash})
      },
      openForceExecuteDialog(strategyHash: string): void {
        dialogForceExecuteRef.current?.openDialog({strategyHash})
      }
    })

    return () => {
      presenter.destroy()
      dialogProvider.destory()
    }
  }, [presenter, dialogProvider])

  return (
    <div>
      <PageHeaderView text={'Orders:'} />
      <PageLayoutWrapper
        fetched={!isLoading}
        refresh={() => {
          presenter.refresh()
        }}
      >
      {
        !isLoading && (strategies?.length ?? 0) === 0
          ? <div>List empty</div>
          : isLoading && <LoadingView />
      }

        <ListContainer ref={listScrollContainerRef}>
          <StrategyListView
            items={strategies ?? []}
            onItemClick={(viewId, item, data) => presenter.onListItemClick(
              viewId,
              item,
              data as number | null | undefined
            )}
            onNextFetch={() => presenter.fetchNextPage()}
            hasNext={!isLastPage}
          />
        </ListContainer>

        <DialogSwapsView ref={dialogSwapsRef} />
        <DialogLogsView ref={dialogLogsRef} />
        <DialogAnalyticsView ref={dialogAnalyticsRef} />
        <DialogDeleteView
          onClickDelete={(hash: string) => presenter.onDeleteStrategyClick(hash)}
          ref={dialogDeleteRef}
        />
        <DialogForceExecuteView
          ref={dialogForceExecuteRef}
          onExecuteClick={(hash: string) => presenter.onForceExecuteClick(hash)}
        />
      </PageLayoutWrapper>
    </div>
  )
}

export default StrategiesPageView
