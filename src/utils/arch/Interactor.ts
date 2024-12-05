export interface Interactor<T, R> {

  invoke(params: T): R
}
