import Cookies from 'js-cookie'
import { Observable } from 'rxjs'
import { AppAuthService } from './AppAuthService.ts'

export class AppAuthServiceImpl extends AppAuthService {

  private static readonly COOKIES_NAME = 'APP.SCALPEL.TOKEN'

  public async saveData(data: string): Promise<void> {

    Cookies.set(AppAuthServiceImpl.COOKIES_NAME, data, {
      secure: true,
      sameSite: 'strict',
    })

    this.data.next(data)
  }

  public async loadData(): Promise<boolean> {
    const result = Cookies.get(AppAuthServiceImpl.COOKIES_NAME)
    this.data.next(result)

    return !!result
  }

  public async clearData(): Promise<void> {
    Cookies.remove(AppAuthServiceImpl.COOKIES_NAME, {
      secure: true,
      sameSite: 'strict',
    })
    this.data.next(undefined)
  }

  public observe(): Observable<string | undefined> {
    return this.data.asObservable()
  }
}
