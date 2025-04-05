import { BasicPresenter } from 'flexdi'
import { Observable } from 'rxjs'

export abstract class LoginPagePresenter extends BasicPresenter<void> {

  public abstract walletAddress(): Observable<string | undefined>

  public abstract IsWalletConnected(): Observable<boolean>

  public abstract connectWalletClick(): void

  public abstract signMessageClick(): void

  public abstract getIsLoading(): Observable<boolean>

  public abstract disconnectWalletClick(): void

  public abstract onDemoClick(): void

  public abstract onRegisterClick(): void
}
