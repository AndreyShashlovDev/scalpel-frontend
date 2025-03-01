import { Wallet } from './WalletConnect.ts'

export interface WalletProvider extends Wallet {
  provider: unknown
}
