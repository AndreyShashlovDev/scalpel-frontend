import { AppKit, createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import type { AppKitNetwork } from '@reown/appkit-common'
import { mainnet, polygon } from '@reown/appkit/networks'
import { BehaviorSubject, Observable } from 'rxjs'
import { Wallet, WalletConnect } from './WalletConnect.ts'

export interface WalletProvider extends Wallet {
  provider: unknown
}

export class WalletConnectImpl extends WalletConnect<WalletProvider> {

  private readonly networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, polygon]
  private readonly ethersAdapter = new EthersAdapter()

  private readonly subject = new BehaviorSubject<WalletProvider | undefined>(undefined)

  private readonly metadata = {
    name: 'Scalpel',
    description: 'Scalpel trading',
    url: 'https://trade-scalpel.com', // origin must match your domain & subdomain
    icons: ['https://avatars.mywebsite.com/']

  }

  private readonly appKit: AppKit

  constructor(private readonly projectId: string) {
    super()

    this.appKit = createAppKit({
      adapters: [this.ethersAdapter],
      networks: this.networks,
      metadata: this.metadata,
      allWallets: 'HIDE',
      showWallets: true,
      projectId: this.projectId,
      features: {
        analytics: false, // Optional - defaults to your Cloud configuration
        socials: [],
        emailShowWallets: true,
        email: false,
      }
    })

    this.appKit.subscribeAccount((e) => {
      if (e.address !== this.subject.value?.address) {
        this.subject.next(e.address
          ? {
            address: e.address!,
            provider: this.appKit.getWalletProvider()
          }
          : undefined)
      }
    })
  }

  public isConnected(): boolean {
    return this.appKit.getIsConnectedState()
  }

  public async connect(): Promise<void> {
    console.error(this.appKit.isOpen(), this.appKit.getIsConnectedState())
    console.log(this.appKit.getWalletProvider())
    if (!this.appKit.isOpen() && !this.appKit.getIsConnectedState()) {
      await this.appKit.open()
    }
  }

  public async disconnect(): Promise<void> {
    await this.ethersAdapter.disconnect()
  }

  public getConnection(): WalletProvider | undefined {
    return this.subject.value
  }

  public observe(): Observable<WalletProvider | undefined> {
    return this.subject.asObservable()
  }
}
