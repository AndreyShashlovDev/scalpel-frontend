import { Wallet } from '../wallet-connect/WalletConnect.ts'

export interface SignedMessage extends Wallet {
  signature: string
}

export abstract class MessageSigner {

  public abstract signMessage(msg: string): Promise<SignedMessage>
}
