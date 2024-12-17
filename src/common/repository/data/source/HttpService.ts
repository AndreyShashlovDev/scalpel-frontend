import { JsonObject } from '../../../../utils/types.ts'

export interface HttpRequest {
  path: string
  query?: Map<string, string>
  body?: JsonObject<unknown>
}

export interface HttpService<T> {

  get(
    request: HttpRequest,
    transform: (response: T) => Promise<T>,
  ): Promise<T>

  post(
    request: HttpRequest,
    transform: (response: T) => Promise<T>,
  ): Promise<T>

  delete(
    request: HttpRequest,
    transform: (response: T) => Promise<T>,
  ): Promise<T>

  put(
    request: HttpRequest,
    transform: (response: T) => Promise<T>,
  ): Promise<T>
}
