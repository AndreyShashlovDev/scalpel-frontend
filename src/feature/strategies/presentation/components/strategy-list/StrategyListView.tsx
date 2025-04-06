import { useObservable } from 'flexdi/react'
import { useCallback } from 'react'
import { Observable } from 'rxjs'
import styled from 'styled-components'
import InfiniteScrollListView, { ListItem } from '../../../../../common/app-ui/AppInfiniteScrollView.tsx'
import { LoadingView } from '../../../../../common/app-ui/LoadingView.tsx'
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
  itemsObservable: Observable<StrategyListItem<unknown>[]> | undefined
  onNextFetch: () => void
  onItemClick: (viewId: number, hash: string, data?: unknown) => void
  hasNext: boolean
  // defaultIndexSelected?: number
  // initialScrollY?: number
}

export const StrategyListView = ({itemsObservable, onNextFetch, hasNext, onItemClick}: StrategyListProps) => {
  const list = useObservable(itemsObservable, [])

  const getHolderView = useCallback((item: ListItem, _: number, ref: (element: HTMLElement | null) => void) => {
    return (
      <ScalpelClassicStrategyHolderView
        item={item as StrategyListItem<ScalpelClassicStrategyOptions>}
        onItemClick={onItemClick}
        key={item.hash}
        ref={ref}
      />
    )
  }, [onItemClick])

  return (
    <ListWrapper
      items={list}
      onNextFetch={onNextFetch}
      hasNext={hasNext}
      loadingElement={<LoadingView />}
      getHolderView={getHolderView}
    />
  )
}
