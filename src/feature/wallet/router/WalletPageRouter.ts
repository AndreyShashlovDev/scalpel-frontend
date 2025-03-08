export abstract class WalletPageRouter {

  public abstract openExportPrivateKey(hash: string, resultId: number): void

  public abstract openDeletePrivateKey(hash: string, resultId: number): void
}
