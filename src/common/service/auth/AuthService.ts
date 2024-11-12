import { Observable } from 'rxjs'

export abstract class AuthService<T> {

  public abstract saveData(data: T): Promise<void>

  public abstract loadData(): Promise<boolean>

  public abstract clearData(): Promise<void>

  public abstract observe(): Observable<T | undefined>
}
