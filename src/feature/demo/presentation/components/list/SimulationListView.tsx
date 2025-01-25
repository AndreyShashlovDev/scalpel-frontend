import styled from 'styled-components'
import InfiniteScrollListView, { ListItemsProps } from '../../../../../common/app-ui/AppInfiniteScrollView.tsx'
import { LoadingView } from '../../../../../common/app-ui/LoadingView.tsx'
import { SimulationListItemModel } from '../../model/SimulationListItemModel.ts'
import { SimulationListHolderView } from './holder/SimulationListHolderView.tsx'

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

export interface SimulationListViewProps extends ListItemsProps<SimulationListItemModel> {
}

export const SimulationListView = ({items, onNextFetch, hasNext, onItemClick}: SimulationListViewProps) => {

  return (
    <ListWrapper
      items={items}
      onNextFetch={onNextFetch}
      hasNext={hasNext}
      loadingElement={<LoadingView />}
      getHolderView={(item, _, ref) => {
        return <SimulationListHolderView
          item={item as SimulationListItemModel}
          key={item.hash}
          ref={ref}
          onItemClick={(hash, viewId, data) => onItemClick(hash, viewId, data)}
        />
      }}
    />
  )
}
