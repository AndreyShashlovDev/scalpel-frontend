import { JsonObject } from '../../../../utils/types.ts'
import { AppResponse } from '../model/AppResponse.ts'
import { AppAuthHttpsService } from './AppAuthHttpsService.ts'
import { HttpRequest, HttpService } from './HttpService.ts'

export class AppSourceService implements HttpService<AppResponse<JsonObject<unknown>>> {

  constructor(
    private readonly appAuthHttpsService: AppAuthHttpsService,
  ) {}

  public async get<T>(path: string, request?: HttpRequest): Promise<AppResponse<JsonObject<T>>> {
    return this.toResponse(() => this.appAuthHttpsService.get(path, request))
  }

  public async post<T>(
    path: string,
    request?: HttpRequest
  ): Promise<AppResponse<JsonObject<T>>> {
    return this.toResponse(() => this.appAuthHttpsService.post(path, request))
  }

  public async delete<T>(
    path: string,
    request?: HttpRequest
  ): Promise<AppResponse<JsonObject<T>>> {
    return this.toResponse(() => this.appAuthHttpsService.delete(path, request))
  }

  public async put<T>(
    path: string,
    request?: HttpRequest
  ): Promise<AppResponse<JsonObject<T>>> {
    return this.toResponse(() => this.appAuthHttpsService.put(path, request))
  }

  private async toResponse<T>(call: () => Promise<Response>): Promise<AppResponse<T>> {
    let isSuccess: boolean
    let data: JsonObject<T> | undefined
    let errors: unknown[] | undefined

    try {
      const response = await call()

      if (response.ok) {
        const json: JsonObject<AppResponse<T>> = await response.json()

        isSuccess = json.success
        data = json.data
        errors = json.errors
      } else {
        isSuccess = false
        errors = [await response.json()]
      }

    } catch (e: unknown) {
      // @ts-expect-error dsffsdf
      if ((e?.statusCode ?? -1) === 401) {
        // await this.authService.clearAuthData()
      }

      isSuccess = false
      errors = [e]
    }

    return new AppResponse<JsonObject<T>>(isSuccess, data, errors)
  }
}
