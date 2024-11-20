import { useLayoutEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import AddIcon from '../../../assets/icons/app/AddIcon.svg'
import { FloatingActionButtonView } from '../../../common/app-ui/presentation/FloatingActionButtonView.tsx'
import { LoadingView } from '../../../common/app-ui/presentation/LoadingView.tsx'
import { PageHeaderView } from '../../../common/app-ui/presentation/PageHeaderView.tsx'
import { PageLayoutView } from '../../../common/app-ui/presentation/PageLayoutView.tsx'
import { ChainType } from '../../../common/repository/data/model/ChainType.ts'
import useObservable from '../../../hooks/useObservable.ts'
import { getDIValue } from '../../../Injections.ts'
import { StrategiesPagePresenter } from '../domain/StrategiesPagePresenter.ts'
import { StrategyDialogProvider } from '../domain/StrategyDialogProvider.ts'
import { DialogDeleteCallBack, DialogDeleteView } from './components/DialogDeleteView.tsx'
import { DialogLogsCallBack, DialogLogsView } from './components/DialogLogsView.tsx'
import { DialogSwapsCallBack, DialogSwapsView } from './components/DialogSwapsView.tsx'
import { StrategyListView } from './components/strategy-list/StrategyListView.tsx'
import '../domain/StrategiesPageModule.ts'

const AddIconWrapper = styled(AddIcon)`
  width: 100%;
  height: auto;
`

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

  const dialogSwapsRef = useRef<DialogSwapsCallBack | null>(null)
  const dialogLogsRef = useRef<DialogLogsCallBack | null>(null)
  const dialogDeleteRef = useRef<DialogDeleteCallBack | null>(null)
  const listScrollContainerRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    presenter.init()

    dialogProvider.setDialogCallback({
      openSwapsDialog(strategyHash: string, chain: ChainType): void {
        dialogSwapsRef.current?.openDialog({strategyHash, chain})
      },
      openLogsDialog(strategyHash: string): void {
        dialogLogsRef.current?.openDialog({strategyHash})
      },
      openDeleteDialog(strategyHash: string): void {
        dialogDeleteRef.current?.openDialog({strategyHash})
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
      fetched={(strategies?.length ?? 0) > 0}
      refresh={() => {
        presenter.refresh()
      }}
    >
      {
        isLastPage && (strategies?.length ?? 0) === 0
          ? 'List empty'
          : (strategies?.length ?? 0) === 0 && <LoadingView />
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

      <FloatingActionButtonView
        scrollView={listScrollContainerRef}
        icon={<AddIconWrapper />}
        onClick={() => {presenter.onCreateNewStrategyClick()}}
      />

      <DialogSwapsView ref={dialogSwapsRef} />
      <DialogLogsView ref={dialogLogsRef} />
      <DialogDeleteView
        onClickDelete={(hash: string) => presenter.onDeleteStrategyClick(hash)}
        ref={dialogDeleteRef}
      />
    </PageLayoutWrapper>
    </div>
  )
}

export default StrategiesPageView
