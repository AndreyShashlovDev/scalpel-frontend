import { Observable } from 'rxjs'
import { MenuItem } from '../../../common/app-ui/AppMenuView.tsx'
import { BasicPresenter } from 'flexdi'

export abstract class AppPresenter extends BasicPresenter<void> {

  public abstract getMainMenuItems(): Observable<MenuItem[]>

  public abstract getSelectedMenuItemId(): Observable<number>

  public abstract onMenuItemClick(id: string | number): void
}
