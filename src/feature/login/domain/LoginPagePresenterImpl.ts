import { BehaviorSubject, map, Observable } from 'rxjs'
import { Wallet, WalletConnect } from '../../../common/service/wallet-connect/WalletConnect.ts'
import { Interactor } from '../../../utils/arch/Interactor.ts'
import { LoginPageRouter } from '../router/LoginPageRouter.ts'
import { LoginPagePresenter } from './LoginPagePresenter.ts'

export class LoginPagePresenterImpl extends LoginPagePresenter {

  private readonly isLoading = new BehaviorSubject(false)

  constructor(
    private readonly walletConnection: WalletConnect<Wallet>,
    private readonly loginInteractor: Interactor<void, Promise<void>>,
    private readonly registrationInteractor: Interactor<void, Promise<string>>,
    private readonly router: LoginPageRouter,
  ) {
    super()
    console.log('CREATE LoginPagePresenterImpl')
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
      .catch(e => console.warn(e))
  }

  public onDemoClick(): void {
    this.router.openDemoPage()
  }

  public onRegisterClick(): void {
    this.registrationInteractor.invoke()
      .then((joinCode) => this.router.openJoinTelegramBot(joinCode))
      .catch(e => console.error(e))
  }
}
