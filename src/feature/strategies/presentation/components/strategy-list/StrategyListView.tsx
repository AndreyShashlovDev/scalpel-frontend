import styled from 'styled-components'
import InfiniteScrollListView from '../../../../../common/app-ui/presentation/AppInfiniteScrollView.tsx'
import { LoadingView } from '../../../../../common/app-ui/presentation/LoadingView.tsx'
import { StrategyListItem } from '../../model/StrategyListItem.ts'
import {
  ScalpelClassicStrategyHolderView,
  ScalpelClassicStrategyOptions
} from './holder/ScalpelClassicStrategyHolderView.tsx'

const ListWrapper = styled(InfiniteScrollListView)`
  display: flex;
  flex-direction: column;
  align-items: center;

  > div {
    margin-bottom: 8px;
  }
  
  > div:last-child {
    margin-bottom: 18px;
  }
`

export interface StrategyListProps {
  items: StrategyListItem<unknown>[]
  onNextFetch: () => void
  onItemClick: (viewId: number, item: StrategyListItem<unknown>, data?: unknown) => void
  hasNext: boolean
  // defaultIndexSelected?: number
  // initialScrollY?: number
}

export const StrategyListView = ({items, onNextFetch, hasNext, onItemClick}: StrategyListProps) => {

  return (
    <ListWrapper
      items={items}
      onNextFetch={onNextFetch}
      hasNext={hasNext}
      loadingElement={<LoadingView />}
      getHolderView={(item, _, ref) => {
        return <ScalpelClassicStrategyHolderView
          item={item as StrategyListItem<ScalpelClassicStrategyOptions>}
          onItemClick={(viewId, data) => onItemClick(
            viewId,
            item as StrategyListItem<ScalpelClassicStrategyOptions>,
            data
          )}
          key={item.hash}
          ref={ref}
        />
      }}
    />
  )
}
