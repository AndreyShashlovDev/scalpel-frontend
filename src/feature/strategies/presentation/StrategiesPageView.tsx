import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import FilterIcon from '../../../assets/icons/app/FilterIcon.svg'
import { DialogQuestionCallBack, DialogQuestionView } from '../../../common/app-ui/dialog/DialogQuestionView.tsx'
import { LoadingView } from '../../../common/app-ui/LoadingView.tsx'
import { PageHeaderView } from '../../../common/app-ui/PageHeaderView.tsx'
import { PageLayoutView } from '../../../common/app-ui/PageLayoutView.tsx'
import useObservable from '../../../utils/di-core/react/hook/useObservable.ts'
import { useInject } from '../../../utils/di-core/react/hook/useInject.ts'
import { usePresenter } from '../../../utils/di-core/react/hook/usePresenter.ts'
import StrategiesFilter from '../domain/model/StrategiesFilter.ts'
import { StrategiesPagePresenter } from '../domain/StrategiesPagePresenter.ts'
import { StrategyPageDialogProvider } from '../router/StrategyPageDialogProvider.ts'
import { DialogAnalyticsCallBack, DialogAnalyticsView } from './components/DialogAnalyticsView.tsx'
import { DialogLogsCallBack, DialogLogsView } from './components/DialogLogsView.tsx'
import { DialogStrategyFilterCallBack, DialogStrategyFilterView } from './components/DialogStrategyFilterView.tsx'
import { DialogSwapsCallBack, DialogSwapsView } from './components/DialogSwapsView.tsx'
import { StrategyListView } from './components/strategy-list/StrategyListView.tsx'

const PageLayoutWrapper = styled(PageLayoutView)`
`

const ListContainer = styled.div`
  overflow-y: auto;
  height: calc(100vh - ${({theme}) => theme.size.header});
  padding-bottom: ${({theme}) => theme.size.header};
`

export const StrategiesPageView = () => {

  const presenter = usePresenter(StrategiesPagePresenter)
  const dialogProvider = useInject(StrategyPageDialogProvider)
  const isEmptyPage = useObservable(presenter.getIsEmpty(), false)
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
      dialogProvider.destroy()
    }
  }, [dialogProvider])

  useEffect(() => {
    if (isLoadingFinished) {
      setPullToRefreshLoading(false)
    }
  }, [isLoadingFinished])

  const handleItemClick = useCallback((viewId: number, hash: string, data?: unknown) => {
    presenter.onListItemClick(
      viewId,
      hash,
      data as number | null | undefined
    )
  }, [presenter])

  const handleFetchNext = useCallback(() => {
    presenter.fetchNextPage()
  }, [presenter])

  const handleRefresh = useCallback(() => {
    setPullToRefreshLoading(true)
    presenter.refresh()
  }, [presenter])

  const headerButtons = useMemo(() => [
    {
      icon: <FilterIcon />,
      onClick: () => presenter.onFilterButtonClick()
    }
  ], [presenter])

  const handleDialogResult = useCallback((data: unknown, dialogId: string | number) => {
    presenter.onActionResultCallback(data, dialogId)
  }, [presenter])

  const handleChangeFilter = useCallback((filter: StrategiesFilter) => {
    presenter.onChangeFilter(filter)
  }, [presenter])

  return (
    <div>
      <PageHeaderView
        text={'Orders'}
        buttons={headerButtons}
      />
      <PageLayoutWrapper
        fetched={!isLoading}
        refresh={handleRefresh}
      >
      {
        !isLoading && isEmptyPage
          ? <div>List empty</div>
          : isLoading && !pullToRefreshLoading && <LoadingView />
      }

        <ListContainer ref={listScrollContainerRef}>
          <StrategyListView
            itemsObservable={presenter.getStrategiesList()}
            onItemClick={handleItemClick}
            onNextFetch={handleFetchNext}
            hasNext={!isLastPage}
          />
        </ListContainer>

        <DialogSwapsView ref={dialogSwapsRef} />
        <DialogLogsView ref={dialogLogsRef} />
        <DialogAnalyticsView ref={dialogAnalyticsRef} />
        <DialogQuestionView
          onOkClick={handleDialogResult}
          ref={dialogQuestionRef}
        />
        <DialogStrategyFilterView
          ref={dialogStrategiesFilterRef}
          onChangeFilter={handleChangeFilter}
        />
      </PageLayoutWrapper>
    </div>
  )
}

export default StrategiesPageView
