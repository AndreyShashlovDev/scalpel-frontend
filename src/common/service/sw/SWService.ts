import { Injectable } from 'flexdi'
import { Observable, Subject } from 'rxjs'
// @ts-expect-error is exported
import { registerSW } from 'virtual:pwa-register'

export enum SWEvent {
  HAS_UPDATE = 'HAS_UPDATE',
  OFFLINE_READY = 'OFFLINE_READY',
  REGISTERED = 'REGISTERED',
  REGISTRATION_ERROR = 'REGISTRATION_ERROR',
  NOT_SUPPORTED = 'NOT_SUPPORTED'
}

@Injectable()
export class SWService {

  private readonly events: Subject<SWEvent> = new Subject()
  private registration: Promise<ServiceWorkerRegistration> | null = null
  private updateSWCallback: (() => Promise<void>) | null = null
  private isReady = false

  constructor() {
    this.initialize()
  }

  public getEvents(): Observable<SWEvent> {
    return this.events.asObservable()
  }

  public isInitialized(): boolean {
    return this.isReady
  }

  private initialize(): void {
    if (!('serviceWorker' in navigator)) {
      console.debug('Service Worker not supported')
      this.events.next(SWEvent.NOT_SUPPORTED)
      return
    }

    try {
      this.updateSWCallback = registerSW({
        onNeedRefresh: () => {
          this.events.next(SWEvent.HAS_UPDATE)
        },
        onOfflineReady: () => {
          this.events.next(SWEvent.OFFLINE_READY)
        },
        onRegisteredSW: async () => {
          this.isReady = true
          this.events.next(SWEvent.REGISTERED)
        },
        onRegisterError: (error: unknown) => {
          console.warn(error)
          this.events.next(SWEvent.REGISTRATION_ERROR)
        }
      })
    } catch (error) {
      console.warn(error)
      this.events.next(SWEvent.REGISTRATION_ERROR)
    }
  }

  public async getRegistration(): Promise<ServiceWorkerRegistration> {
    if (!this.registration) {
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported')
      }
      this.registration = navigator.serviceWorker.ready
    }
    return this.registration
  }

  public async updateServiceWorker(): Promise<void> {
    if (this.updateSWCallback) {
      await this.updateSWCallback()
      console.debug('Service Worker success updated')
    }
  }
}
