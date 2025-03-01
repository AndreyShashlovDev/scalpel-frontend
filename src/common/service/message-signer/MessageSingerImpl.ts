import { BrowserProvider, Eip1193Provider } from 'ethers'
import { WalletConnect } from '../wallet-connect/WalletConnect.ts'
import { WalletProvider } from '../wallet-connect/WalletProvider.ts'
import { MessageSigner, SignedMessage } from './MessageSigner.ts'

export class MessageSingerImpl extends MessageSigner {

  constructor(private readonly walletConnect: WalletConnect<WalletProvider>) {
    super()
  }

  public async signMessage(msg: string): Promise<SignedMessage> {
    const connection = this.walletConnect.getConnection()

    if (!connection) {
      throw new Error('provider not presented')
    }

    const provider = new BrowserProvider(connection.provider as Eip1193Provider)
    const signer = await provider.getSigner()
    const signature = await signer.signMessage(msg)

    return {
      address: connection.address,
      signature
    }
  }
}
