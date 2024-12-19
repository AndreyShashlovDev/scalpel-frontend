import { Observable } from 'rxjs'
import { Preference } from '../model/Preference.ts'

export abstract class PreferencesRepository {

  public abstract getUserPreference(): Promise<Preference | undefined>

  public abstract updateUserPreference(entity: Partial<Preference>): Promise<void>

  public abstract observe(): Observable<Preference | undefined>
}
