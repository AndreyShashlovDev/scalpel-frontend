import { Observable, Subject } from 'rxjs'

export type NavigatorOptions = { replace?: boolean, state?: unknown, preventScrollReset?: boolean }
export type Navigator = {
  (route: string, options?: NavigatorOptions): void
  (delta: number): void;
}

export type RouteEvent = { path: string, replace: boolean }

export abstract class BasicRouter {

  private navigate: Navigator | undefined
  protected stack: string[] = []
  private readonly navigationSubject = new Subject<RouteEvent>()
  private readonly deepLink: string | null

  protected constructor() {
    window.addEventListener('popstate', () => {
      if (!this.onBackPress()) {
        window.history.pushState({}, '')
      }
    })

    const params = new URLSearchParams(window.location.search)
    this.deepLink = params.get('deeplink')

    if (!this.deepLink && params.get('post')) {
      this.deepLink = params.get('post')
      params.delete('post')
    }

    if (this.deepLink) {
      params.delete('deeplink')
      window.history.replaceState({}, '', window.location.origin + window.location.pathname + params.toString())
    }
  }

  public openAppRootPage(): void {
    window.location.reload()
  }

  public getDeepLink(): string | null {
    return this.deepLink
  }

  public getCurrentPath(): string | undefined {
    return this.stack[this.stack.length - 1]
  }

  public getNavigationObservable(): Observable<RouteEvent> {
    return this.navigationSubject.asObservable()
  }

  public getNavigationPath(): string[] {
    return Array.from(this.stack)
  }

  public setNavigate(navigateFunc: Navigator) {
    this.navigate = navigateFunc
  }

  public back() {
    window.history.back()
  }

  protected onBackPress(): boolean {
    if (this.navigate) {
      this.stack.pop()
      this.navigate(-1)

      this.navigationSubject.next({path: this.stack[this.stack.length - 1], replace: false})
      return true
    }

    return false
  }

  public navigateTo(route: string, options?: NavigatorOptions) {
    const updatedOptions = {
      ...options,
      ...{
        replace: options?.replace ?? false,
        preventScrollReset: options?.preventScrollReset ?? true
      }
    }

    const hasParams = route.indexOf('?') > -1
    const uniqueRoute = route + `${hasParams ? '&' : '?'}timestamp=${Date.now()}`

    this.navigationSubject.next({path: route, replace: updatedOptions.replace})

    if (this.navigate) {
      if (options?.replace && this.stack.length > 0) {
        this.stack[this.stack.length - 1] = uniqueRoute

        if (this.stack.length > 1) {
          window.history.replaceState({}, '')
        }

      } else {
        this.stack.push(uniqueRoute)

        if (this.stack.length > 1) {
          window.history.pushState({}, '')
        }
      }

      this.navigate(uniqueRoute, updatedOptions)
    } else {
      console.error('Navigate function not initialized')
    }
  }
}
