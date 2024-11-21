import styled from 'styled-components'
import InfiniteScrollListView from '../../../../../common/app-ui/presentation/AppInfiniteScrollView.tsx'
import { LoadingView } from '../../../../../common/app-ui/presentation/LoadingView.tsx'
import { LogListItemModel } from '../../model/LogListItemModel.ts'
import { LogsListHolderView } from './holder/LogsListHolderView.tsx'

const ListWrapper = styled(InfiniteScrollListView)`
  background: ${({theme}) => theme.color.background};
  
  display: flex;
  flex-direction: column;
  align-items: center;
  
  > div {
    margin-bottom: 8px;
  }

  > div:last-child {
    margin-bottom: 32px;
  }
`

export interface LogsListViewProps {
  items: LogListItemModel[]
  onNextFetch: () => void
  hasNext: boolean
}

export const LogsListView = ({items, onNextFetch, hasNext}: LogsListViewProps) => {

  return (
    <ListWrapper
      items={items}
      onNextFetch={onNextFetch}
      hasNext={hasNext}
      loadingElement={<LoadingView />}
      getHolderView={(item, _, ref) => {
        return <LogsListHolderView
          item={item as LogListItemModel}
          key={item.hash}
          ref={ref}
        />
      }}
    />
  )
}
