import styled from 'styled-components'
import InfiniteScrollListView, {
  ListItemsProps
} from '../../../../../common/app-ui/AppInfiniteScrollView.tsx'
import { LoadingView } from '../../../../../common/app-ui/LoadingView.tsx'
import { WalletListItemModel } from '../../model/WalletListItemModel.ts'
import { WalletHolderView } from './holder/WalletHolderView.tsx'

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

export interface WalletListViewProps extends ListItemsProps<WalletListItemModel> {
}

export const WalletListView = ({items, hasNext, onNextFetch, onItemClick}: WalletListViewProps) => {

  return (
    <ListWrapper
      items={items}
      onNextFetch={() => onNextFetch}
      hasNext={hasNext}
      loadingElement={<LoadingView />}
      getHolderView={(item, _, ref) => {
        return <WalletHolderView
          item={item as WalletListItemModel}
          key={item.hash}
          onItemClick={(hash, viewId, data) => onItemClick(hash, viewId, data)}
          ref={ref}
        />
      }}
    />
  )
}
