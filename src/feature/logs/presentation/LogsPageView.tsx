import { useLayoutEffect, useMemo } from 'react'
import styled from 'styled-components'
import { ComponentSize } from '../../../common/app-ui/presentation/ComponentSize.ts'
import { LoadingView } from '../../../common/app-ui/presentation/LoadingView.tsx'
import { PageLayoutView } from '../../../common/app-ui/presentation/PageLayoutView.tsx'
import useObservable from '../../../hooks/useObservable.ts'
import { getDIValue } from '../../../Injections.ts'
import { LogsPagePresenter } from '../domain/LogsPagePresenter.ts'
import '../domain/LogsPagePresenterModule.ts'
import { LogsListView } from './components/swap-list/LogsListView.tsx'

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

export const LogsPageView = ({strategyHash}: LogsPageProps) => {

  const presenter = useMemo(() => getDIValue(LogsPagePresenter), [])
  const logItemsList = useObservable(presenter.getLogItems(), [])
  const isLastPage = useObservable(presenter.getIsLastPage(), true)
  const isLoading = useObservable(presenter.getIsLoading(), true)

  useLayoutEffect(() => {
    if (strategyHash) {
      presenter.setStrategyHash(strategyHash)
    }

    presenter.init()

    return () => presenter.destroy()
  }, [strategyHash, presenter])

  return (
    <Container
      refresh={() => presenter.refresh()}
      fetched={!isLoading}
    >
      {
        (isLoading && isLastPage) ? <LoadingView size={ComponentSize.STANDARD} /> : undefined
      }
      {
        (!isLoading && logItemsList.length === 0)
          ? <div>List is empty</div>
          : (
            <ListContainer>
              <LogsListView
                items={logItemsList}
                onNextFetch={() => presenter.onFetchNext()}
                hasNext={!isLastPage}
              />
            </ListContainer>
          )
      }
    </Container>
  )
}
