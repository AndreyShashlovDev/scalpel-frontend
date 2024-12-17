import styled from 'styled-components'
import InfiniteScrollListView from '../../../../../common/app-ui/AppInfiniteScrollView.tsx'
import { LoadingView } from '../../../../../common/app-ui/LoadingView.tsx'
import { TransactionListItemModel } from '../../model/TransactionListItemModel.ts'
import { TransactionHolderView } from './holder/TransactionHolderView.tsx'

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

export interface TransactionListProps {
  items: TransactionListItemModel[]
  hasNext: boolean
  onNextFetch: () => void
}

export const TransactionListView = ({items, hasNext, onNextFetch}: TransactionListProps) => {

  return (
    <ListWrapper
      items={items}
      onNextFetch={() => onNextFetch()}
      hasNext={hasNext}
      loadingElement={<LoadingView />}
      getHolderView={(item, _, ref) => {
        return <TransactionHolderView
          item={item as TransactionListItemModel}
          key={item.hash}
          ref={ref}
        />
      }}
    />
  )
}
