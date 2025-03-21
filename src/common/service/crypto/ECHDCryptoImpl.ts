import { Injectable } from '../../../utils/di-core/decorator/decorators.ts'
import { ECHDCrypto, PublicKeyVector } from './ECHDCrypto.ts'

@Injectable()
export class ECHDCryptoImpl extends ECHDCrypto {

  private static readonly KEY_LIFETIME_MS = 10000
  private readonly KEY_BY_ALIAS: Map<string, CryptoKeyPair> = new Map()

  public async createKeyPair(privateKeyAlias: string): Promise<PublicKeyVector> {
    if (!window.isSecureContext) {
      throw new Error('Web Crypto API may be limited: not in secure context')
    }

    const keyPair = await window.crypto.subtle.generateKey(
      {name: 'ECDH', namedCurve: 'P-256'},
      true,
      ['deriveKey', 'deriveBits']
    )

    const webKey = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey)

    if (!webKey.x || !webKey.y) {
      throw new Error('Cannot create keypair')
    }

    this.KEY_BY_ALIAS.set(privateKeyAlias, keyPair)

    setTimeout(() => {this.KEY_BY_ALIAS.delete(privateKeyAlias)}, ECHDCryptoImpl.KEY_LIFETIME_MS)

    return new PublicKeyVector(webKey.x, webKey.y)
  }

  public async decrypt(
    encryptedData: string,
    ivHex: string,
    authTagHex: string,
    privateKeyAlias: string,
    publicKeyJwk: PublicKeyVector
  ): Promise<string> {
    const keyPair = this.KEY_BY_ALIAS.get(privateKeyAlias)

    if (!keyPair) {
      throw new Error('keypair not found by alias')
    }

    try {
      const serverPublicKey = await window.crypto.subtle.importKey(
        'jwk',
        {
          kty: 'EC',
          crv: 'P-256',
          x: publicKeyJwk.x,
          y: publicKeyJwk.y,
          ext: true
        },
        {
          name: 'ECDH',
          namedCurve: 'P-256'
        },
        false,
        []
      )

      const sharedBits = await window.crypto.subtle.deriveBits(
        {
          name: 'ECDH',
          public: serverPublicKey
        },
        keyPair.privateKey,
        256
      )

      const derivedKey = await window.crypto.subtle.digest('SHA-256', sharedBits)

      const aesKey = await window.crypto.subtle.importKey(
        'raw',
        derivedKey,
        {
          name: 'AES-GCM',
        },
        false,
        ['decrypt']
      )

      const iv = this.hexToArrayBuffer(ivHex)
      const authTag = this.hexToArrayBuffer(authTagHex)

      const encryptedBuffer = this.hexToArrayBuffer(encryptedData)
      const ciphertext = new Uint8Array(encryptedBuffer.byteLength + authTag.byteLength)
      ciphertext.set(new Uint8Array(encryptedBuffer), 0)
      ciphertext.set(new Uint8Array(authTag), encryptedBuffer.byteLength)

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          tagLength: 128
        },
        aesKey,
        ciphertext
      )

      return new TextDecoder().decode(decrypted)
    } finally {
      this.KEY_BY_ALIAS.delete(privateKeyAlias)
    }
  }

  private hexToArrayBuffer(hexString: string): ArrayBuffer {
    hexString = hexString.startsWith('0x') ? hexString.slice(2) : hexString

    const byteArray = new Uint8Array(hexString.length / 2)

    for (let i = 0; i < byteArray.length; i++) {
      byteArray[i] = parseInt(hexString.slice(i * 2, i * 2 + 2), 16)
    }

    return byteArray.buffer
  }
}
