import { useInject, useObservable, usePresenter } from 'flexdi/react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import FilterIcon from '../../../assets/icons/app/FilterIcon.svg'
import NotificationIcon from '../../../assets/icons/app/NotificationIcon.svg'
import { DialogQuestionCallBack, DialogQuestionView } from '../../../common/app-ui/dialog/DialogQuestionView.tsx'
import { LoadingView } from '../../../common/app-ui/LoadingView.tsx'
import { PageHeaderView } from '../../../common/app-ui/PageHeaderView.tsx'
import { PageLayoutView } from '../../../common/app-ui/PageLayoutView.tsx'
import StrategiesFilter from '../domain/model/StrategiesFilter.ts'
import { StrategiesPagePresenter } from '../domain/StrategiesPagePresenter.ts'
import { StrategyPageDialogProvider } from '../router/StrategyPageDialogProvider.ts'
import { DialogStrategyFilterCallBack, DialogStrategyFilterView } from './components/DialogStrategyFilterView.tsx'
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
  const listScrollPosition = useObservable(presenter.getListScrollY(), undefined)

  const dialogQuestionRef = useRef<DialogQuestionCallBack | null>(null)
  const listScrollContainerRef = useRef<HTMLDivElement | null>(null)
  const dialogStrategiesFilterRef = useRef<DialogStrategyFilterCallBack | null>(null)
  const [pullToRefreshLoading, setPullToRefreshLoading] = useState(false)

  useLayoutEffect(() => {
    dialogProvider.setDialogCallback({
      openQuestionDialog(title: string, message: string, data: unknown, resultId: number): void {
        dialogQuestionRef.current?.openDialog({
          title,
          message,
          data,
          dialogId: resultId
        })
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
      icon: <NotificationIcon />,
      onClick: () => presenter.onNotificationClick()
    },
    {
      icon: <FilterIcon />,
      onClick: () => presenter.onFilterButtonClick()
    },
  ], [presenter])

  const handleDialogResult = useCallback((data: unknown, dialogId: string | number) => {
    presenter.onActionResultCallback(data, dialogId)
  }, [presenter])

  const handleChangeFilter = useCallback((filter: StrategiesFilter) => {
    presenter.onChangeFilter(filter)
  }, [presenter])

  useEffect(() => {
    const abortController = new AbortController()
    const element = listScrollContainerRef.current

    if (element) {
      element.addEventListener('scroll', () => {
        presenter.setListScrollY(Math.round(element.scrollTop))
      }, {signal: abortController.signal})
    }

    return () => abortController.abort()
  }, [listScrollContainerRef, presenter])

  useEffect(() => {
    const element = listScrollContainerRef.current

    if (element && listScrollPosition && Math.round(element.scrollTop) !== listScrollPosition) {
      element.scrollTo({
        top: listScrollPosition,
        behavior: 'instant'
      })
    }
  }, [listScrollPosition, listScrollContainerRef])

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
