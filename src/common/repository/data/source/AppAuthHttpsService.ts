import { AppAuthService } from '../../../service/auth/AppAuthService.ts'
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
  ) {
    this.authService.loadData()

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

  public async get(
    request: HttpRequest,
    transform: (response: Response) => Promise<Response>,
  ): Promise<Response> {
    const url = this.getUrl(request.path)

    request?.query?.forEach((value, key) => {
      url.searchParams.set(key, value)
    })

    return transform(await fetch(url, {method: 'GET', headers: this.getHeaders()})
      .then(async response => {
        if (!response.ok) {
          this.catchException(await response.json())
        }
        return response
      })
    )
  }

  public post(
    request: HttpRequest,
    transform: (response: Response) => Promise<Response>,
  ): Promise<Response> {
    return this.modifyQuery('POST', request, transform)
  }

  public delete(
    request: HttpRequest,
    transform: (response: Response) => Promise<Response>,
  ): Promise<Response> {
    return this.modifyQuery('DELETE', request, transform)
  }

  public put(
    request: HttpRequest,
    transform: (response: Response) => Promise<Response>,
  ): Promise<Response> {
    return this.modifyQuery('PUT', request, transform)
  }

  public async modifyQuery(
    method: 'POST' | 'DELETE' | 'PUT',
    request: HttpRequest,
    transform: (response: Response) => Promise<Response>,
  ): Promise<Response> {
    const url = this.getUrl(request.path)

    request?.query?.forEach((value, key) => {
      url.searchParams.set(key, value)
    })

    return transform(await fetch(
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

    throw appError
  }
}
