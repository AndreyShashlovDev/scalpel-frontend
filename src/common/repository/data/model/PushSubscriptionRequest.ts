export enum PushProvider {
  WEB_PUSH = 'WEB_PUSH'
}

export class PushDataRequest {

  public readonly p256dh: string
  public readonly auth: string

  constructor(p256dh: string, auth: string) {
    this.p256dh = p256dh
    this.auth = auth
  }
}

export class PushSubscriptionRequest {

  public readonly provider: PushProvider
  public readonly token: string
  public readonly data: PushDataRequest

  constructor(provider: PushProvider, token: string, data: PushDataRequest) {
    this.provider = provider
    this.token = token
    this.data = data
  }
}
