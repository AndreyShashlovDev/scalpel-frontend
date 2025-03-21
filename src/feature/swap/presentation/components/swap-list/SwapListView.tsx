import styled from 'styled-components'
import InfiniteScrollListView from '../../../../../common/app-ui/AppInfiniteScrollView.tsx'
import { LoadingView } from '../../../../../common/app-ui/LoadingView.tsx'
import { SwapListItemModel } from '../../model/SwapListItemModel.ts'
import { SwapListHolderView } from './holder/SwapListHolderView.tsx'

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

export interface StrategyListProps {
  items: SwapListItemModel[]
  onNextFetch: () => void
  hasNext: boolean
}

export const StrategyListView = ({items, onNextFetch, hasNext}: StrategyListProps) => {

  return (
    <ListWrapper
      items={items}
      onNextFetch={onNextFetch}
      hasNext={hasNext}
      loadingElement={<LoadingView />}
      getHolderView={(item, _, ref) => {
        return <SwapListHolderView
          item={item as SwapListItemModel}
          key={item.hash}
          ref={ref}
        />
      }}
    />
  )
}
