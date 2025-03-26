import { RouteStateManager } from './RouteStateManager.ts'

export class MemoryRouteStateManagerImpl extends RouteStateManager {

  private readonly state: Map<string, Record<string, unknown>> = new Map()

  constructor() {
    super()
  }

  public saveSate(route: string, bundle: Record<string, unknown>): void {
    this.state.set(route, bundle)
  }

  public getAndDelete(route: string): Record<string, unknown> | undefined {
    const bundle = this.state.get(route)
    this.state.delete(route)

    return bundle
  }
}
