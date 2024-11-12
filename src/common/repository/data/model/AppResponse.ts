import { JsonObject } from '../../../../utils/types.ts'

export class AppResponse<T> {

  public readonly success: boolean
  public readonly data?: JsonObject<T>
  public readonly errors?: unknown[]

  constructor(success: boolean, data?: T, errors?: unknown[]) {
    this.success = success
    this.data = data
    this.errors = errors
  }
}
