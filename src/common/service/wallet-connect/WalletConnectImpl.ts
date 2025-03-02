import { AppKit, createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import type { AppKitNetwork } from '@reown/appkit-common'
import { mainnet, polygon } from '@reown/appkit/networks'
import { BehaviorSubject, Observable } from 'rxjs'
import { UnknownException } from '../../repository/data/source/exception/UnknownException.ts'
import { ExceptionNotifierService } from '../exception-handler/ExceptionNotifierService.ts'
import { WalletConnect } from './WalletConnect.ts'
import { WalletProvider } from './WalletProvider.ts'

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

  constructor(
    private readonly projectId: string,
    private readonly exceptionNotifierService: ExceptionNotifierService,
  ) {
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
        collapseWallets: true,
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
    try {
      if (!this.appKit.isOpen() && !this.appKit.getIsConnectedState()) {
        await this.appKit.open()
      }
    } catch (e) {
      // @ts-expect-error has message
      this.exceptionNotifierService.notify(UnknownException.create(e.message))
      throw e
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.appKit.disconnect()

      this.subject.next(undefined)
    } catch (e) {
      // @ts-expect-error has message
      this.exceptionNotifierService.notify(UnknownException.create(e.message))
      throw e
    }
  }

  public getConnection(): WalletProvider | undefined {
    return this.subject.value
  }

  public observe(): Observable<WalletProvider | undefined> {
    return this.subject.asObservable()
  }
}
