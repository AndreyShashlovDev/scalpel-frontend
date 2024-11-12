export abstract class BasicPresenter {

  private initCount = 0

  public init(): void {
    this.initCount++

    if (this.initCount === 2) {
      this.ready()
    }
  }

  public abstract ready(): void

  public abstract destroy(): void
}
