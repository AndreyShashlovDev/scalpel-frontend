export interface Interactor<T, R> {

  invoke(): R

  invoke(params: T): R
}
