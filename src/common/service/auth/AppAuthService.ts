import { BehaviorSubject } from 'rxjs'
import { AuthService } from './AuthService.ts'

export abstract class AppAuthService extends AuthService<string> {

  protected data: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined)
}
