import { Observable } from 'rxjs'
import { BasicPresenter } from '../../../../utils/arch/BasicPresenter.ts'

export class SnackBarItem {

  public readonly id: string | number
  public readonly text: string
  public readonly closeButton?: boolean
  public readonly timeoutClose?: number

  constructor(id: string | number, text: string, closeButton: boolean | undefined, timeoutClose: number | undefined) {
    this.id = id
    this.text = text
    this.closeButton = closeButton
    this.timeoutClose = timeoutClose
  }
}

export abstract class SnackbarPresenter extends BasicPresenter<void> {

  public abstract getBarItems(): Observable<SnackBarItem[]>

  public abstract onCloseItem(id: string | number, isAuto: boolean): void
}
