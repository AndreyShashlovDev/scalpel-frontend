export abstract class NotificationRepository {

  public abstract getPublicKey(): Promise<string>

  public abstract subscribe(token: string, data: Record<string, string>): Promise<void>

  public abstract unsubscribe(token?: string | undefined): Promise<void>
}
