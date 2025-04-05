import { Inject, Injectable } from 'flexdi'
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs'
import { MenuItem } from '../../../common/app-ui/AppMenuView.tsx'
import { AppException } from '../../../common/repository/data/source/exception/AppException.ts'
import { UnauthorizedException } from '../../../common/repository/data/source/exception/UnauthorizedException.ts'
import { RouterPath } from '../../../common/router/domain/ApplicationRouter.ts'
import { AppAuthService } from '../../../common/service/auth/AppAuthService.ts'
import { ExceptionHandlerService } from '../../../common/service/exception-handler/ExceptionHandlerService.ts'
import { PushNotificationService } from '../../../common/service/notification/PushNotificationService.ts'
import { AppRouter } from '../router/AppRouter.ts'
import { AppMainMenuIds } from './AppMainMenuIds.ts'
import { AppPresenter } from './AppPresenter.ts'

@Injectable()
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

  private readonly menuItemsByPath = new Map<string, number>([
    [RouterPath.Orders.path, AppMainMenuIds.ORDERS_MENU_ID],
    [RouterPath.Wallets.path, AppMainMenuIds.WALLET_MENU_ID],
    [RouterPath.Transactions.path, AppMainMenuIds.TRANSACTIONS_MENU_ID],
    [RouterPath.CreateOrder.path, AppMainMenuIds.CREATE_ORDER_MENU_ID],
    [RouterPath.Simulation.path, AppMainMenuIds.SIMULATION_MENU_ID],
  ])

  constructor(
    @Inject(ExceptionHandlerService) private readonly exceptionNotifierService: ExceptionHandlerService,
    @Inject(AppAuthService) private readonly authService: AppAuthService,
    @Inject(AppRouter) private readonly router: AppRouter,
    @Inject(PushNotificationService) private readonly pushNotificationService: PushNotificationService,
  ) {
    super()
  }

  public destroy(): void {
    // do not use
  }

  public ready(): void {
    this.router.getNavigationObservable()
      .pipe(
        distinctUntilChanged((prev, current) => prev.path == current.path)
      )
      .subscribe({
        next: (value) => {
          const menuId = this.menuItemsByPath.get(value.path)

          if (menuId != undefined && this.selectedMenuItem.value !== menuId) {
            this.selectedMenuItem.next(menuId)
          }
        }
      })

    this.exceptionNotifierService
      .observe()
      .subscribe({
        next: (error: AppException) => {
          if (error instanceof UnauthorizedException) {
            const mustRedirect = this.router.getCurrentPath() !== '/' &&
              this.router.getCurrentPath() !== '/splash' &&
              this.router.getCurrentPath() !== undefined

            if (mustRedirect) {
              this.authService.clearData()
                .then(() => {this.router.openLoginPage()})
            }
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
      this.pushNotificationService.unsubscribe(/* only current device */ true)
        .then(() => this.authService.clearData())
        .then(() => {
          this.router.openLoginPage()
          this.selectedMenuItem.next(AppMainMenuIds.ORDERS_MENU_ID)
        })
    }

    const item = this.menuItems.value.find(item => item.id === id)

    if ((item?.selectable ?? true)) {
      this.selectedMenuItem.next(Number(id))
    }
  }
}
