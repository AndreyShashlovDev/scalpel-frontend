import styled from 'styled-components'
import InfiniteScrollListView from '../../../../../common/app-ui/presentation/AppInfiniteScrollView.tsx'
import { LoadingView } from '../../../../../common/app-ui/presentation/LoadingView.tsx'
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

export interface WalletListViewProps {
  items: WalletListItemModel[]
  hasNext: boolean
  onFetchNext: () => void
}

export const WalletListView = ({items, hasNext, onFetchNext}: WalletListViewProps) => {

  return (
    <ListWrapper
      items={items}
      onNextFetch={() => onFetchNext}
      hasNext={hasNext}
      loadingElement={<LoadingView />}
      getHolderView={(item, _, ref) => {
        return <WalletHolderView
          item={item as WalletListItemModel}
          key={item.hash}
          ref={ref}
        />
      }}
    />
  )
}
