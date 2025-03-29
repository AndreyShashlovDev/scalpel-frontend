import { Inject, Injectable } from '../../../../utils/di-core/decorator/decorators.ts'
import { PushDataRequest, PushProvider, PushSubscriptionRequest } from '../model/PushSubscriptionRequest.ts'
import { AppSourceService } from '../source/AppSourceService.ts'
import { UnknownException } from '../source/exception/UnknownException.ts'
import { NotificationRepository } from './NotificationRepository.ts'

@Injectable()
export class NotificationRepositoryImpl extends NotificationRepository {

  constructor(
    @Inject(AppSourceService) private readonly appSourceService: AppSourceService,
  ) {
    super()
  }

  public async getPublicKey(): Promise<string> {
    return this.appSourceService.get<string, string>(
      {path: `/notification/`},

      async (response) => {
        if (response.success && response.data) {
          return response.data
        }

        throw UnknownException.create()
      },
    )
  }

  public subscribe(token: string, data: Record<string, string>): Promise<void> {
    return this.appSourceService.post<void, void>(
      {
        path: `/notification/`,
        body: new PushSubscriptionRequest(
          PushProvider.WEB_PUSH,
          token,
          new PushDataRequest(data.p256dh, data.auth),
        )
      },

      async (response) => {
        if (response.success) {
          return
        }

        throw UnknownException.create()
      },
    )

  }

  public unsubscribe(token?: string | undefined): Promise<void> {
    const query = new Map<string, string>()
    if (token) {
      query.set('token', token)
    }

    return this.appSourceService.delete<void, void>(
      {
        path: `/notification/`,
        query
      },

      async (response) => {
        if (response.success) {
          return
        }

        throw UnknownException.create()
      },
    )
  }
}
