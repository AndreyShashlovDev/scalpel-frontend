import { Observable } from 'rxjs'
import { AuthRepository } from '../../repository/data/auth-repository/AuthRepository.ts'
import { AppAuthHttpsService } from '../../repository/data/source/AppAuthHttpsService.ts'
import { AppAuthService } from './AppAuthService.ts'

export class AppAuthServiceImpl extends AppAuthService {

  private loaded: boolean = false

  constructor(
    private readonly appAuthHttpsService: AppAuthHttpsService,
    private readonly authRepository: AuthRepository
  ) {
    super()
  }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async saveData(_data: string): Promise<void> {
    // this.appAuthHttpsService.setToken(data)
    this.loaded = true
  }

  public async loadData(): Promise<boolean> {
    try {
      await this.authRepository.refreshToken()
      this.loaded = true
      // this.appAuthHttpsService.setToken()
      return true
    } catch (e) {
      console.error(e)
    }

    return false
  }

  public async clearData(): Promise<void> {
    if (!this.loaded) {
      return
    }

    this.appAuthHttpsService.setToken(undefined)
    await this.authRepository.logout()
    this.loaded = false
  }

  public observe(): Observable<string | undefined> {
    return this.data.asObservable()
  }
}
