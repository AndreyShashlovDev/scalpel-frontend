import { Observable } from 'rxjs'

export interface Wallet {
  address: string
}

export abstract class WalletConnect<T extends Wallet> {

  public abstract isConnected(): boolean

  public abstract connect(): Promise<void>

  public abstract disconnect(): Promise<void>

  public abstract getConnection(): T | undefined

  public abstract observe(): Observable<T | undefined>
}
