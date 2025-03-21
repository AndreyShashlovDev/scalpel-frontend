import { BehaviorSubject, Observable } from 'rxjs'
import { Inject, Injectable } from '../../../../utils/di-core/decorator/decorators.ts'
import { ExceptionHandlerService } from '../../../service/exception-handler/ExceptionHandlerService.ts'
import { SnackBarItem, SnackbarPresenter } from './SnackbarPresenter.ts'

@Injectable()
export class SnackbarPresenterImpl extends SnackbarPresenter {

  private readonly items: BehaviorSubject<SnackBarItem[]> = new BehaviorSubject<SnackBarItem[]>([])

  constructor(
    @Inject(ExceptionHandlerService) readonly exceptionHandlerService: ExceptionHandlerService
  ) {
    super()

    exceptionHandlerService.observe().subscribe({
      next: e => this.addMessage(e.message)
    })

    window.onerror = (errorMsg) => {
      this.addMessage('Global on error:' + JSON.stringify(errorMsg))
      return false
    }
  }

  public ready(): void {
  }

  public destroy(): void {
  }

  public getBarItems(): Observable<SnackBarItem[]> {
    return this.items.asObservable()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onCloseItem(id: string | number, /* isAuto closed*/ _: boolean): void {
    this.items.next(this.items.value.filter(item => item.id !== id))
  }

  private addMessage(msg: string): void {
    const id = Math.random()
    const timeout = 5000

    const list = this.items.value.concat([
      new SnackBarItem(
        id,
        msg,
        true,
        timeout,
      )
    ])

    setTimeout(() => {this.onCloseItem(id, true)}, timeout)
    this.items.next(list)
  }
}
