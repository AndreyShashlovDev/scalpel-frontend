import { JsonObject } from '../../../../utils/types.ts'

export interface HttpRequest {
  query?: Map<string, string>
  body?: JsonObject<unknown>
}

export interface HttpService<T> {

  get(path: string, request?: HttpRequest): Promise<T>

  post(
    path: string,
    request?: HttpRequest,
  ): Promise<T>

  delete(
    path: string,
    request?: HttpRequest,
  ): Promise<T>

  put(
    path: string,
    request?: HttpRequest,
  ): Promise<T>
}
