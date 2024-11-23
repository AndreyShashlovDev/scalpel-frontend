import { ListItem } from '../../../../common/app-ui/presentation/AppInfiniteScrollView.tsx'

export class WalletListItemModel implements ListItem {

  public readonly hash: string
  public readonly address: string
  public readonly name?: string

  constructor(hash: string, address: string, name: string | undefined) {
    this.hash = hash
    this.address = address
    this.name = name
  }
}
