import { Injectable } from '@di-core/decorator/decorators.ts'
import { Observable, Subject } from 'rxjs'
import { Preference } from '../model/Preference.ts'
import { PreferencesRepository } from './PreferencesRepository.ts'

@Injectable()
export class PreferencesRepositoryImpl extends PreferencesRepository {

  private static readonly PREFERENCE_KEY = 'SCALPEL_PREFERENCE'
  private readonly subject = new Subject<Preference | undefined>()

  public async getUserPreference(): Promise<Preference | undefined> {
    try {
      const jsonString = localStorage.getItem(PreferencesRepositoryImpl.PREFERENCE_KEY)

      return JSON.parse(jsonString ?? '{}')
    } catch (e) {
      console.log(e)
      return undefined
    }
  }

  public async updateUserPreference(entity: Partial<Preference>): Promise<void> {
    const user = await this.getUserPreference()
    const merged = Object.assign({}, user, entity)
    const jsonString = JSON.stringify(merged)

    this.subject.next(merged)

    localStorage.setItem(PreferencesRepositoryImpl.PREFERENCE_KEY, jsonString)
  }

  public observe(): Observable<Preference | undefined> {
    return this.subject.asObservable()
  }
}
