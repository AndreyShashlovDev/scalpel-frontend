export interface DialogRouter {

}

export interface BasicDialogProvider<D extends DialogRouter> {
  getDialogs(): D | undefined
}

export abstract class DialogProvider<D extends DialogRouter> implements BasicDialogProvider<D> {

  private callbacks?: D = {} as D

  public setDialogCallback(callback: D): void {
    this.callbacks = callback
  }

  public getDialogs(): D | undefined {
    return this.callbacks
  }

  public destroy(): void {
    this.callbacks = undefined
  }
}
