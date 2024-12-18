import { JsonObject } from '../../../../utils/types.ts'
import { ExceptionNotifierService } from '../../../service/exception-handler/ExceptionNotifierService.ts'
import { AppResponse } from '../model/AppResponse.ts'
import { AppAuthHttpsService } from './AppAuthHttpsService.ts'
import { AppException } from './exception/AppException.ts'
import { UnknownException } from './exception/UnknownException.ts'
import { HttpRequest, HttpService } from './HttpService.ts'

export class AppSourceService implements HttpService<AppResponse<JsonObject<unknown>>> {

  constructor(
    private readonly appAuthHttpsService: AppAuthHttpsService,
    private readonly exceptionNotifierService: ExceptionNotifierService,
  ) {}

  private async nonTransform<T>(response: T): Promise<T> {
    return response
  }

  public async get<R, T>(
    request: HttpRequest,
    transform: (response: AppResponse<JsonObject<R>>) => Promise<T>,
  ): Promise<T> {
    return this.transform(
      await this.toResponse<R>(() => this.appAuthHttpsService.get(request, this.nonTransform)),
      transform
    )
  }

  public async post<R, T>(
    request: HttpRequest,
    transform: (response: AppResponse<JsonObject<R>>) => Promise<T>,
  ): Promise<T> {
    return this.transform(
      await this.toResponse<R>(() => this.appAuthHttpsService.post(request, this.nonTransform)),
      transform
    )
  }

  public async delete<R, T>(
    request: HttpRequest,
    transform: (response: AppResponse<JsonObject<R>>) => Promise<T>,
  ): Promise<T> {
    return this.transform(
      await this.toResponse<R>(() => this.appAuthHttpsService.delete(request, this.nonTransform)),
      transform
    )
  }

  public async put<R, T>(
    request: HttpRequest,
    transform: (response: AppResponse<JsonObject<R>>) => Promise<T>,
  ): Promise<T> {
    return this.transform(
      await this.toResponse<R>(() => this.appAuthHttpsService.put(request, this.nonTransform)),
      transform
    )
  }

  private async transform<R, T>(
    response: AppResponse<JsonObject<R>>,
    transform: (response: AppResponse<JsonObject<R>>) => Promise<T>
  ): Promise<T> {
    try {
      return await transform(response)
    } catch (e) {
      // @ts-expect-error has message
      const error: AppException = (e instanceof AppException) ? e : UnknownException.create(e.message ?? '')

      this.exceptionNotifierService.notify(error)
      throw error
    }
  }

  private async toResponse<R>(call: () => Promise<Response>): Promise<AppResponse<R>> {
    let isSuccess: boolean
    let data: JsonObject<R> | undefined
    let errors: unknown[] | undefined

    try {
      const response = await call()

      if (response.ok) {
        const json: JsonObject<AppResponse<R>> = await response.json()

        isSuccess = json.success
        data = json.data
        errors = json.errors
      } else {
        isSuccess = false
        errors = [await response.json()]
      }

    } catch (e: unknown) {

      if (e instanceof AppException) {
        this.exceptionNotifierService.notify(e)
        throw e
      }

      isSuccess = false
      errors = [e]
    }

    return new AppResponse<JsonObject<R>>(isSuccess, data, errors)
  }
}
