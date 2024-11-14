import { IS_PRODUCTION } from '../../Injections.ts'

export abstract class BasicPresenter {

  private initCount = 0

  public init(): void {
    this.initCount++

    if (this.initCount === (IS_PRODUCTION ? 1 : 2)) {
      this.ready()
    }
  }

  public abstract ready(): void

  public abstract destroy(): void
}
