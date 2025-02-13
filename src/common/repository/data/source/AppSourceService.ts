import { JsonObject } from '../../../../utils/types.ts'
import { AppResponse } from '../model/AppResponse.ts'
import { HttpRequest, HttpService } from './HttpService.ts'

export abstract class AppSourceService implements HttpService<AppResponse<JsonObject<unknown>>> {

  public abstract get<R, T>(
    request: HttpRequest,
    transform: (response: AppResponse<JsonObject<R>>) => Promise<T>,
  ): Promise<T>

  public abstract post<R, T>(
    request: HttpRequest,
    transform: (response: AppResponse<JsonObject<R>>) => Promise<T>,
  ): Promise<T>

  public abstract delete<R, T>(
    request: HttpRequest,
    transform: (response: AppResponse<JsonObject<R>>) => Promise<T>,
  ): Promise<T>

  public abstract put<R, T>(
    request: HttpRequest,
    transform: (response: AppResponse<JsonObject<R>>) => Promise<T>,
  ): Promise<T>
}
