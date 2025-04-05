import { Inject, Injectable } from 'flexdi'
import { BehaviorSubject, filter, Observable, Subject } from 'rxjs'
import { Retry } from '../../../utils/Retry.ts'
import { NotificationRepository } from '../../repository/data/notification/NotificationRepository.ts'
import { SWEvent, SWService } from '../sw/SWService.ts'
import {
  ButtonActionEvent,
  ErrorStatus,
  NotificationMessage,
  NotReadyStatus,
  PermissionStatus,
  PushNotificationService,
  PushNotificationServiceStatus,
  ReadyStatus
} from './PushNotificationService.ts'

@Injectable()
export class PushNotificationServiceImpl extends PushNotificationService {

  public static readonly SUBSCRIPTION_KEY = 'scalpel.web.push.key'

  public readonly statusSubject = new BehaviorSubject(new NotReadyStatus())
  private readonly messageSubject = new Subject<NotificationMessage>()
  private readonly actionSubject = new Subject<ButtonActionEvent>()

  constructor(
    @Inject(SWService) private readonly swService: SWService,
    @Inject(NotificationRepository) private readonly notificationRepository: NotificationRepository,
  ) {
    super()

    this.initialize()
  }

  private initialize() {
    this.swService.getEvents()
      .pipe(filter(event =>
        event === SWEvent.REGISTRATION_ERROR ||
        event === SWEvent.REGISTERED ||
        event === SWEvent.NOT_SUPPORTED)
      )
      .subscribe({
        next: (event: SWEvent) => {
          const canUse = 'PushManager' in window && event === SWEvent.REGISTERED

          if (canUse) {
            this.statusSubject.next(new ReadyStatus())

            this.getNotificationPermission()
              .then(granted => {
                if (!granted) {
                  this.unsubscribe(/* only current */ true).catch(e => console.error(e))
                }
              })
          } else {
            console.warn('Push not supported!')
            this.statusSubject.next(new ErrorStatus('Push not supported'))
          }
        }
      })

    this.pushSubscriptions()
  }

  private pushSubscriptions(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'PUSH_RECEIVED') {
          this.messageSubject.next(event.data.data)
        }
      })

      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'NOTIFICATION_ACTION') {
          this.actionSubject.next(event.data.data)
        }
      })
    }
  }

  public status(): Observable<PushNotificationServiceStatus> {
    return this.statusSubject.asObservable()
  }

  public isReady(): boolean {
    return this.statusSubject.value instanceof ReadyStatus
  }

  public onReceiveNotification(): Observable<NotificationMessage> {
    return this.messageSubject.asObservable()
  }

  public onReceiveNotificationAction(): Observable<ButtonActionEvent> {
    return this.actionSubject.asObservable()
  }

  public async getNotificationPermission(): Promise<PermissionStatus> {
    return Notification.permission
  }

  public async hasSubscription(): Promise<boolean> {
    if (!this.swService.isInitialized()) {
      return false
    }

    const registration = await this.swService.getRegistration()
    const pushSubscription = await this.getCurrentSubscription(registration)

    return !!pushSubscription
  }

  public async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission()

      return permission === 'granted'
    } catch (error) {
      console.error(error)
      return false
    }
  }

  private async getCurrentSubscription(registration: ServiceWorkerRegistration): Promise<PushSubscription | null> {
    try {
      return await registration.pushManager.getSubscription()

    } catch (error) {
      console.error(error)
    }

    return null
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }

    return outputArray
  }

  public async subscribe(): Promise<boolean> {
    if (!this.swService.isInitialized()) {
      return false
    }

    const registration = await this.swService.getRegistration()
    const pushSubscription = await this.getCurrentSubscription(registration)

    if (pushSubscription) {
      return true
    }

    const publicKey = await this.notificationRepository.getPublicKey()

    try {
      const permission = await this.getNotificationPermission()

      if (permission !== 'granted') {
        const permissionGranted = await this.requestPermission()

        if (!permissionGranted) {
          return false
        }
      }

      const options = {
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(publicKey)
      }

      const subscription = await registration.pushManager.subscribe(options)

      localStorage.setItem(PushNotificationServiceImpl.SUBSCRIPTION_KEY, subscription.endpoint)
      const json = subscription.toJSON()

      return await Retry(() => this.notificationRepository.subscribe(json.endpoint ?? '', json.keys ?? {}), 3, 1000)
        .then(() => true)
        .catch(() => {
          this.unsubscribe(/* only current */ true)
          return false
        })
    } catch (error) {
      console.error(error)
      return false
    }
  }

  public async unsubscribe(onlyCurrent?: boolean): Promise<boolean> {
    try {
      if (!this.swService.isInitialized()) {
        return false
      }

      const registration = await this.swService.getRegistration()
      const pushSubscription = await this.getCurrentSubscription(registration)

      if (pushSubscription) {
        await pushSubscription.unsubscribe()
      }

      const key = onlyCurrent
        ? pushSubscription?.endpoint ?? localStorage.getItem(PushNotificationServiceImpl.SUBSCRIPTION_KEY) ?? undefined
        : undefined

      if (!key && onlyCurrent) {
        return true
      }

      return await Retry(() => this.notificationRepository.unsubscribe(key), 3, 1000)
        .then(() => {
          localStorage.removeItem(PushNotificationServiceImpl.SUBSCRIPTION_KEY)
          return true
        })
        .catch(() => {
          pushSubscription?.unsubscribe().catch(e => console.error(e))
          return false
        })

    } catch (error) {
      console.error(error)
      return false
    }
  }
}
