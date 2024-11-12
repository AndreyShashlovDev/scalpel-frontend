import { useLayoutEffect, useMemo } from 'react'
import styled from 'styled-components'
import useObservable from '../../../hooks/useObservable.ts'
import { getDIValue } from '../../../Injections.ts'
import { LogsPagePresenter } from '../domain/LogsPagePresenter.ts'
import '../domain/LogsPagePresenterModule.ts'
import { LogsListView } from './components/swap-list/LogsListView.tsx'

const Container = styled.div`
  overflow: hidden;
  height: 100vh;
  background: ${({theme}) => theme.color.background};
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
  const isLastPage = useObservable(presenter.getIsLastPage(), false)

  useLayoutEffect(() => {
    if (strategyHash) {
      presenter.setStrategyHash(strategyHash)
    }

    presenter.init()

    return () => presenter.destroy()
  }, [strategyHash, presenter])

  return (
    <Container>
      <ListContainer>
        <LogsListView
          items={logItemsList}
          onNextFetch={() => presenter.onFetchNext()}
          hasNext={!isLastPage}
        />
      </ListContainer>
    </Container>
  )
}
