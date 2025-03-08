export class PublicKeyVector {

  public readonly x: string
  public readonly y: string

  constructor(x: string, y: string) {
    this.x = x
    this.y = y
  }
}

export abstract class ECHDCrypto {

  public abstract createKeyPair(privateKeyAlias: string): Promise<PublicKeyVector>

  public abstract decrypt(
    encryptedData: string,
    ivHex: string,
    authTagHex: string,
    privateKeyAlias: string,
    publicKeyJwk: PublicKeyVector,
  ): Promise<string>
}
