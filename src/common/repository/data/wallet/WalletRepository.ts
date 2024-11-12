import { WalletResponse } from '../model/WalletResponse.ts'

export abstract class WalletRepository {

  public abstract getWallets(): Promise<WalletResponse[]>

  public abstract createWallet(): Promise<string>
}
