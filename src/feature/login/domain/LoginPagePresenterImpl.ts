import { BehaviorSubject, map, Observable } from 'rxjs'
import { AppAuthService } from '../../../common/service/auth/AppAuthService.ts'
import { Wallet, WalletConnect } from '../../../common/service/wallet-connect/WalletConnect.ts'
import { Interactor } from '../../../utils/arch/Interactor.ts'
import { LoginPagePresenter } from './LoginPagePresenter.ts'
import { LoginPageRouter } from './router/LoginPageRouter.ts'

export class LoginPagePresenterImpl extends LoginPagePresenter {

  private readonly isLoading = new BehaviorSubject(true)

  constructor(
    private readonly walletConnection: WalletConnect<Wallet>,
    private readonly loginInteractor: Interactor<void, Promise<void>>,
    readonly authService: AppAuthService,
    private readonly router: LoginPageRouter,
  ) {
    super()

    authService.loadData()
      .then((hasAuth) => {
        if (hasAuth) {
          this.router.openStrategiesPage()

        } else {
          this.isLoading.next(false)
        }
      })
      .catch(e => {
        console.error(e)
        this.isLoading.next(false)
      })
  }

  public ready(): void {
  }

  public destroy(): void {
  }

  public getIsLoading(): Observable<boolean> {
    return this.isLoading.asObservable()
  }

  public walletAddress(): Observable<string | undefined> {
    return this.walletConnection
      .observe()
      .pipe(map(data => data?.address))
  }

  public IsWalletConnected(): Observable<boolean> {
    return this.walletConnection
      .observe()
      .pipe(map(data => data?.address !== undefined && this.walletConnection.isConnected()))
  }

  public connectWalletClick(): void {
    this.walletConnection.connect().catch(e => console.warn(e))
  }

  public signMessageClick(): void {
    this.loginInteractor.invoke()
      .then(() => this.router.openStrategiesPage())
      .catch(e => console.error(e))
  }

  public disconnectWalletClick(): void {
    this.walletConnection.disconnect()
  }
}
