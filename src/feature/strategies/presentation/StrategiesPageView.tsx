import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import FilterIcon from '../../../assets/icons/app/FilterIcon.svg'
import { DialogQuestionCallBack, DialogQuestionView } from '../../../common/app-ui/dialog/DialogQuestionView.tsx'
import { LoadingView } from '../../../common/app-ui/LoadingView.tsx'
import { PageHeaderView } from '../../../common/app-ui/PageHeaderView.tsx'
import { PageLayoutView } from '../../../common/app-ui/PageLayoutView.tsx'
import useObservable from '../../../hooks/useObservable.ts'
import { usePresenter } from '../../../hooks/usePresenter.ts'
import { getDIValue } from '../../../Injections.ts'
import StrategiesFilter from '../domain/model/StrategiesFilter.ts'
import { StrategiesPagePresenter } from '../domain/StrategiesPagePresenter.ts'
import { StrategyPageDialogProvider } from '../router/StrategyPageDialogProvider.ts'
import { DialogAnalyticsCallBack, DialogAnalyticsView } from './components/DialogAnalyticsView.tsx'
import { DialogLogsCallBack, DialogLogsView } from './components/DialogLogsView.tsx'
import { DialogStrategyFilterCallBack, DialogStrategyFilterView } from './components/DialogStrategyFilterView.tsx'
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

  const presenter = usePresenter(StrategiesPagePresenter)
  const dialogProvider = useMemo(() => getDIValue(StrategyPageDialogProvider), [])
  const strategies = useObservable(presenter.getStrategiesList(), undefined)
  const isLastPage = useObservable(presenter.getIsLastPage(), true)
  const isLoading = useObservable(presenter.getIsLoading(), true)
  const isLoadingFinished = useObservable(presenter.getLoadingFinished(), undefined)

  const dialogSwapsRef = useRef<DialogSwapsCallBack | null>(null)
  const dialogLogsRef = useRef<DialogLogsCallBack | null>(null)
  const dialogQuestionRef = useRef<DialogQuestionCallBack | null>(null)
  const dialogAnalyticsRef = useRef<DialogAnalyticsCallBack | null>(null)
  const listScrollContainerRef = useRef<HTMLDivElement | null>(null)
  const dialogStrategiesFilterRef = useRef<DialogStrategyFilterCallBack | null>(null)
  const [pullToRefreshLoading, setPullToRefreshLoading] = useState(false)

  useLayoutEffect(() => {
    dialogProvider.setDialogCallback({
      openSwapsDialog(strategyHash: string): void {
        dialogSwapsRef.current?.openDialog({strategyHash})
      },
      openLogsDialog(strategyHash: string): void {
        dialogLogsRef.current?.openDialog({strategyHash})
      }, openQuestionDialog(title: string, message: string, data: unknown, resultId: number): void {
        dialogQuestionRef.current?.openDialog({
          title,
          message,
          data,
          dialogId: resultId
        })
      },
      openAnalyticsDialog(strategyHash: string): void {
        dialogAnalyticsRef.current?.openDialog({strategyHash})
      },
      openStrategyFilterDialog(filter: StrategiesFilter): void {
        dialogStrategiesFilterRef.current?.openDialog({filter})
      }
    })

    return () => {
      dialogProvider.destory()
    }
  }, [dialogProvider])

  useEffect(() => {
    if (isLoadingFinished) {
      setPullToRefreshLoading(false)
    }
  }, [isLoadingFinished])

  return (
    <div>
      <PageHeaderView
        text={'Orders'}
        buttons={[
          {
            icon: <FilterIcon />,
            onClick: () => presenter.onFilterButtonClick()
          }
        ]}
      />
      <PageLayoutWrapper
        fetched={!isLoading}
        refresh={() => {
          setPullToRefreshLoading(true)
          presenter.refresh()
        }}
      >
      {
        !isLoading && (strategies?.length ?? 0) === 0
          ? <div>List empty</div>
          : isLoading && !pullToRefreshLoading && <LoadingView />
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
        <DialogQuestionView
          onOkClick={(data: unknown, dialogId) => presenter.onActionResultCallback(data, dialogId)}
          ref={dialogQuestionRef}
        />
        <DialogStrategyFilterView
          ref={dialogStrategiesFilterRef}
          onChangeFilter={(filter) => presenter.onChangeFilter(filter)}
        />
      </PageLayoutWrapper>
    </div>
  )
}

export default StrategiesPageView
