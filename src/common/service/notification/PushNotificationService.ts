import { Observable } from 'rxjs'

export type PermissionStatus = 'default' | 'denied' | 'granted' | 'prompt'

export abstract class PushNotificationServiceStatus {}

export class NotReadyStatus extends PushNotificationServiceStatus {}

export class ReadyStatus extends PushNotificationServiceStatus {}

export class ErrorStatus extends PushNotificationServiceStatus {
  constructor(public readonly msg: string) {
    super()
  }
}

export class NotificationAction {

  public static valueOfJson(json: Readonly<NotificationAction>): NotificationAction {
    return new NotificationAction(
      json.action,
      json.title,
      json.icon
    )
  }

  public readonly action: string
  public readonly title: string
  public readonly icon?: string

  constructor(action: string, title: string, icon?: string) {
    this.action = action
    this.title = title
    this.icon = icon
  }
}

export class NotificationMessage {

  public static valueOfJson(json: Readonly<NotificationMessage>): NotificationMessage {
    return new NotificationMessage(
      json.title ?? 'Scalpel',
      json.body ?? '',
      json.data,
      Array.isArray(json.actions) ? json.actions.map(NotificationAction.valueOfJson) : undefined,
      json.icon,
      json.silent,
      json.badge,
      json.forceShow,
    )
  }

  public readonly title: string
  public readonly body: string
  public readonly data?: unknown
  public readonly actions?: NotificationAction[]
  public readonly icon?: string
  public readonly silent?: boolean
  public readonly badge?: string
  public readonly forceShow?: boolean

  constructor(
    title: string,
    body: string,
    data?: unknown,
    actions?: NotificationAction[],
    icon?: string,
    silent?: boolean,
    badge?: string,
    forceShow?: boolean,
  ) {
    this.title = title
    this.body = body
    this.data = data
    this.actions = actions
    this.icon = icon
    this.silent = silent
    this.badge = badge
    this.forceShow = forceShow
  }
}

export class ButtonActionEvent {

  public readonly action: string
  public readonly data?: unknown

  constructor(action: string, data?: unknown) {
    this.action = action
    this.data = data
  }
}

export abstract class PushNotificationService {

  public abstract status(): Observable<PushNotificationServiceStatus>

  public abstract isReady(): boolean

  public abstract onReceiveNotification(): Observable<NotificationMessage>

  public abstract onReceiveNotificationAction(): Observable<ButtonActionEvent>

  public abstract getNotificationPermission(): Promise<PermissionStatus>

  public abstract hasSubscription(): Promise<boolean>

  public abstract requestPermission(): Promise<boolean>

  public abstract subscribe(): Promise<boolean>

  public abstract unsubscribe(onlyCurrent?: boolean): Promise<boolean>
}
