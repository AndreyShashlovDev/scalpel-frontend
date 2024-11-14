import { AppAuthService } from '../../../service/auth/AppAuthService.ts'
import { ExceptionNotifierService } from '../../../service/exception-handler/ExceptionNotifierService.ts'
import { AppException } from './exception/AppException.ts'
import { UnauthorizedException } from './exception/UnauthorizedException.ts'
import { UnknownException } from './exception/UnknownException.ts'
import { HttpRequest, HttpService } from './HttpService.ts'

export class AppAuthHttpsService implements HttpService<Response> {

  private authToken: string | undefined

  constructor(
    private readonly base: string,
    private readonly prefix: string,
    private readonly authService: AppAuthService,
    private readonly exceptionNotifierService: ExceptionNotifierService,
  ) {
    this.authService
      .observe()
      .subscribe({
        next: (data: string | undefined) => {
          if (data) {
            this.authToken = data

          } else {
            this.authToken = undefined
          }
        }
      })
  }

  public get(path: string, request?: HttpRequest): Promise<Response> {
    const url = this.getUrl(path)

    request?.query?.forEach((value, key) => {
      url.searchParams.set(key, value)
    })

    return fetch(url, {method: 'GET', headers: this.getHeaders()})
      .then(async response => {
        if (!response.ok) {
          this.catchException(await response.json())
        }
        return response
      })
      .catch(e => {
          this.catchException(e)
          throw e
        }
      )
  }

  public post(
    path: string,
    request?: HttpRequest,
  ): Promise<Response> {
    return this.modifyQuery('POST', path, request)
  }

  public delete(
    path: string,
    request?: HttpRequest,
  ): Promise<Response> {
    return this.modifyQuery('DELETE', path, request)
  }

  public put(
    path: string,
    request?: HttpRequest,
  ): Promise<Response> {
    return this.modifyQuery('PUT', path, request)
  }

  public modifyQuery(
    method: 'POST' | 'DELETE' | 'PUT',
    path: string,
    request?: HttpRequest,
  ): Promise<Response> {
    const url = this.getUrl(path)

    request?.query?.forEach((value, key) => {
      url.searchParams.set(key, value)
    })

    return fetch(
      url,
      {
        method,
        body: request?.body ? JSON.stringify(request.body) : undefined,
        headers: this.getHeaders(!!request?.body)
      }
    ).then(async response => {
      if (!response.ok) {
        this.catchException(await response.json())
      }
      return response
    })
      .catch(e => {
          this.catchException(e)
          throw e
        }
      )
  }

  private getUrl(path: string): URL {
    return new URL(this.prefix + path, this.base)
  }

  private getHeaders(hasBody?: boolean): Record<string, string> {
    const headers: Record<string, string> = {
      'accept': 'application/json',
    }

    if (hasBody) {
      headers['content-type'] = 'application/json'
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    return headers
  }

  private catchException(e: Error | { message: string, statusCode: number } | unknown): void {
    let appError: AppException | undefined
    const hasStatusCode = typeof e === 'object' && Object.prototype.hasOwnProperty.call(e, 'statusCode')

    if (hasStatusCode) {
      // @ts-expect-error already check existed field
      if (e.statusCode === 401) {
        this.authService.clearData()

        appError = UnauthorizedException.create()
      }
    }

    if (!appError) {
      appError = UnknownException.create(JSON.stringify(e))
    }

    this.exceptionNotifierService.notify(appError)
    
    throw appError
  }
}
