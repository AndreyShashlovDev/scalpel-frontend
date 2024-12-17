import { Observable } from 'rxjs'
import { MenuItem } from '../../../common/app-ui/AppMenuView.tsx'
import { BasicPresenter } from '../../../utils/arch/BasicPresenter.ts'

export abstract class AppPresenter extends BasicPresenter {

  public abstract getMainMenuItems(): Observable<MenuItem[]>

  public abstract getSelectedMenuItemId(): Observable<number>

  public abstract onMenuItemClick(id: string | number): void
}
