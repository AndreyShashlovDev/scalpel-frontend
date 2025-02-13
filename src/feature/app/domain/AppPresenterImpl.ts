import { BehaviorSubject, Observable } from 'rxjs'
import { MenuItem } from '../../../common/app-ui/AppMenuView.tsx'
import { AppException } from '../../../common/repository/data/source/exception/AppException.ts'
import { UnauthorizedException } from '../../../common/repository/data/source/exception/UnauthorizedException.ts'
import { AppAuthService } from '../../../common/service/auth/AppAuthService.ts'
import { ExceptionHandlerService } from '../../../common/service/exception-handler/ExceptionHandlerService.ts'
import { AppRouter } from '../router/AppRouter.ts'
import { AppMainMenuIds } from './AppMainMenuIds.ts'
import { AppPresenter } from './AppPresenter.ts'

export class AppPresenterImpl extends AppPresenter {

  private readonly selectedMenuItem = new BehaviorSubject<number>(AppMainMenuIds.ORDERS_MENU_ID)

  private readonly menuItems = new BehaviorSubject<MenuItem[]>([
    {text: 'Orders', id: AppMainMenuIds.ORDERS_MENU_ID},
    {text: 'Wallets', id: AppMainMenuIds.WALLET_MENU_ID},
    {text: 'Transactions', id: AppMainMenuIds.TRANSACTIONS_MENU_ID},
    {text: 'Create order', id: AppMainMenuIds.CREATE_ORDER_MENU_ID},
    {text: 'Simulation', id: AppMainMenuIds.SIMULATION_MENU_ID},
    {text: undefined, id: -1},// space
    {text: 'Logout', id: AppMainMenuIds.LOGOUT, selectable: false},
  ])

  constructor(
    private readonly exceptionNotifierService: ExceptionHandlerService,
    private readonly authService: AppAuthService,
    private readonly router: AppRouter,
  ) {
    super()
  }

  public destroy(): void {
    // do not use
  }

  public ready(): void {
    this.exceptionNotifierService
      .observe()
      .subscribe({
        next: (error: AppException) => {
          if (error instanceof UnauthorizedException) {
            this.authService.clearData()
              .then(() => {this.router.openLoginPage()})
          }
        }
      })
  }

  public getMainMenuItems(): Observable<MenuItem[]> {
    return this.menuItems.asObservable()
  }

  public getSelectedMenuItemId(): Observable<number> {
    return this.selectedMenuItem.asObservable()
  }

  public onMenuItemClick(id: string | number): void {
    if (id === AppMainMenuIds.ORDERS_MENU_ID) {
      this.router.openStrategiesPage()

    } else if (id === AppMainMenuIds.CREATE_ORDER_MENU_ID) {
      this.router.openCreateStrategyPage()

    } else if (id === AppMainMenuIds.WALLET_MENU_ID) {
      this.router.openWalletsPage()

    } else if (id === AppMainMenuIds.TRANSACTIONS_MENU_ID) {
      this.router.openTransactionsPage()

    } else if (id === AppMainMenuIds.SIMULATION_MENU_ID) {
      this.router.openSimulationPage()

    } else if (id === AppMainMenuIds.LOGOUT) {
      this.authService.clearData()
        .then(() => this.router.openLoginPage())
      this.selectedMenuItem.next(AppMainMenuIds.ORDERS_MENU_ID)
    }

    const item = this.menuItems.value.find(item => item.id === id)

    if ((item?.selectable ?? true)) {
      this.selectedMenuItem.next(Number(id))
    }
  }
}
