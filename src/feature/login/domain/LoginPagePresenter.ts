import { Observable } from 'rxjs'
import { BasicPresenter } from '../../../utils/arch/BasicPresenter.ts'

export abstract class LoginPagePresenter extends BasicPresenter {

  public abstract walletAddress(): Observable<string | undefined>

  public abstract IsWalletConnected(): Observable<boolean>

  public abstract connectWalletClick(): void

  public abstract signMessageClick(): void

  public abstract getIsLoading(): Observable<boolean>

  public abstract disconnectWalletClick(): void
}
