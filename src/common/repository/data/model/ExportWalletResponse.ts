import { JsonObject } from '../../../../utils/types.ts'
import { PublicKeyVector } from '../../../service/crypto/ECHDCrypto.ts'

export class ExportWalletResponse {

  public static valueOfJson(json: JsonObject<ExportWalletResponse>): ExportWalletResponse {
    return new ExportWalletResponse(
      json.pub,
      json.data,
      json.iv,
      json.tag
    )
  }

  public readonly pub: PublicKeyVector
  public readonly data: string
  public readonly iv: string
  public readonly tag: string

  constructor(pub: PublicKeyVector, data: string, iv: string, tag: string) {
    this.pub = pub
    this.data = data
    this.iv = iv
    this.tag = tag
  }
}
