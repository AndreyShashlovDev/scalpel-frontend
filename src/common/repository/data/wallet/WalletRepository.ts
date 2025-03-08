import { Address } from '../../../../utils/types.ts'
import { ExportWalletResponse } from '../model/ExportWalletResponse.ts'
import { Pageable } from '../model/Pageable.ts'
import { WalletResponse } from '../model/WalletResponse.ts'
import { WalletStatisticResponse } from '../model/WalletStatisticResponse.ts'

export abstract class WalletRepository {

  public abstract getWallets(): Promise<WalletResponse[]>

  public abstract createWallet(): Promise<string>

  public abstract getStatistic(page: number, limit: number): Promise<Pageable<WalletStatisticResponse>>

  public abstract changeWalletName(account: Address, name: string | null): Promise<void>

  public abstract exportWallet(msg: string, sig: string): Promise<ExportWalletResponse>
}
