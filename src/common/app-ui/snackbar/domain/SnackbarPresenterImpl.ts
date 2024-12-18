import * as console from 'node:console'
import { BehaviorSubject, Observable } from 'rxjs'
import { ExceptionHandlerService } from '../../../service/exception-handler/ExceptionHandlerService.ts'
import { SnackBarItem, SnackbarPresenter } from './SnackbarPresenter.ts'

export class SnackbarPresenterImpl extends SnackbarPresenter {

  private readonly items: BehaviorSubject<SnackBarItem[]> = new BehaviorSubject<SnackBarItem[]>([])

  constructor(readonly exceptionHandlerService: ExceptionHandlerService) {
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

  public onCloseItem(id: string | number, isAuto: boolean): void {
    this.items.next(this.items.value.filter(item => item.id !== id))
    console.log(isAuto)
  }

  private addMessage(msg: string): void {
    const id = Math.random()
    const timeout = 15000

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
