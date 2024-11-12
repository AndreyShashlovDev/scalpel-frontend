import { JsonObject } from '../../../../utils/types.ts'

export class WalletResponse {

  public static valueOfJson(json: JsonObject<WalletResponse>): WalletResponse {
    return new WalletResponse(
      json.address,
      json.name
    )
  }

  public readonly address: string
  public readonly name?: string

  constructor(address: string, name: string | undefined) {
    this.address = address
    this.name = name
  }
}
