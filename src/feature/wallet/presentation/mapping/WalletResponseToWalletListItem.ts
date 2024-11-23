import { WalletResponse } from '../../../../common/repository/data/model/WalletResponse.ts'
import { WalletListItemModel } from '../model/WalletListItemModel.ts'

export const WalletResponseToWalletListItem = (response: WalletResponse) => new WalletListItemModel(
  response.address,
  response.address,
  response.name
)
