export abstract class RouteStateManager {

  public abstract saveSate(route: string, bundle: Record<string, unknown>): void

  public abstract getAndDelete(string: string): Record<string, unknown> | undefined
}
