import { BehaviorSubject, Observable } from 'rxjs'
import { CurrencyRepository } from '../../../common/repository/data/currencies/CurrencyRepository.ts'
import { ChainType } from '../../../common/repository/data/model/ChainType.ts'
import { CurrencyResponse } from '../../../common/repository/data/model/CurrencyResponse.ts'
import { StrategyType } from '../../../common/repository/data/model/StrategyType.ts'
import { WalletResponse } from '../../../common/repository/data/model/WalletResponse.ts'
import { WalletRepository } from '../../../common/repository/data/wallet/WalletRepository.ts'
import { AddressShortener } from '../../../utils/Shortener.ts'
import { Address } from '../../../utils/types.ts'
import { CreateScalpelStrategyRequest } from '../data/model/CreateStrategyRequest.ts'
import { StrategyRepository } from '../data/strategy-repository/StrategyRepository.ts'
import { ClassicScalpelOptionsData } from '../presentation/components/strategy-options/ClassicScalpelOptionsView.tsx'
import { StrategyOptionsData } from '../presentation/components/strategy-options/StrategyOptionsProps.ts'
import { CreateStrategyPagePresenter } from './CreateStrategyPagePresenter.ts'
import { CreateStrategyRouter } from './router/CreateStrategyRouter.ts'

export enum State {
  CHAIN = 'CHAIN',
  // STRATEGY = 'STRATEGY'
  COIN = 'COIN',
  WALLET = 'WALLET',
  OPTIONS = 'OPTIONS',
}

export class CreateStrategyPagePresenterImpl extends CreateStrategyPagePresenter {

  private readonly chainByAlias = new Map([
    ['Ethereum', ChainType.ETHEREUM_MAIN_NET],
    ['Polygon', ChainType.POLYGON],
  ])

  private readonly coinsByAlias = new Map<string, CurrencyResponse>()
  private readonly walletsByAlias = new Map<string, WalletResponse>()

  private readonly state: BehaviorSubject<State> = new BehaviorSubject<State>(State.CHAIN)
  private readonly isSimulation: BehaviorSubject<boolean> = new BehaviorSubject(false)
  private readonly canNext: BehaviorSubject<boolean> = new BehaviorSubject(false)
  private readonly availableChains: BehaviorSubject<string[]> = new BehaviorSubject(Array.from(this.chainByAlias.keys()))
  private readonly availableCoins: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  private readonly availableWallets: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  private readonly showLoading: BehaviorSubject<boolean> = new BehaviorSubject(false)
  private readonly showCreateLoading: BehaviorSubject<boolean> = new BehaviorSubject(false)

  private readonly selectedStrategy = new BehaviorSubject<StrategyType | undefined>(StrategyType.CLASSIC_SCALPEL)
  private readonly selectedChain = new BehaviorSubject<ChainType | undefined>(undefined)
  private readonly selectedCoinA = new BehaviorSubject<CurrencyResponse | undefined>(undefined)
  private readonly selectedCoinB = new BehaviorSubject<CurrencyResponse | undefined>(undefined)
  private readonly selectedWallet = new BehaviorSubject<Address | undefined>(undefined)

  private strategyOptionsData: ClassicScalpelOptionsData | undefined

  constructor(
    private readonly currencyRepository: CurrencyRepository,
    private readonly walletRepository: WalletRepository,
    private readonly strategyRepository: StrategyRepository,
    private readonly createStrategyRouter: CreateStrategyRouter,
    readonly simulation: boolean
  ) {
    super()
    this.isSimulation.next(simulation)
  }

  public destroy(): void {
  }

  public ready(): void {
    this.state.subscribe({
      next: (state) => {
        if (state === State.CHAIN) {
          this.showLoading.next(false)

        } else if (state === State.COIN) {
          if (this.availableCoins.value.length === 0) {
            this.fetchCoins()
          }

        } else if (state === State.WALLET) {
          if (this.availableWallets.value.length === 0) {
            this.fetchWallets()
          }
        }

        // if (state === State.CHAIN && this.selectedChain) {
        //   this.canNext.next(true)
        //   return
        // } else if ()

        this.canNext.next(false)
      }
    })
  }

  public getCurrentState(): Observable<State> {
    return this.state.asObservable()
  }

  public getIsSimulation(): Observable<boolean> {
    return this.isSimulation.asObservable()
  }

  public isCanShowLoading(): Observable<boolean> {
    return this.showLoading.asObservable()
  }

  public isCanNext(): Observable<boolean> {
    return this.canNext.asObservable()
  }

  public onClickNext(): void {
    const state = this.state.value

    if (state === State.CHAIN) {
      this.state.next(State.COIN)

    } else if (state === State.COIN) {
      if (this.isSimulation.value) {
        this.state.next(State.OPTIONS)
      } else {
        this.state.next(State.WALLET)
      }

    } else if (state === State.WALLET) {
      this.state.next(State.OPTIONS)

    } else if (state === State.OPTIONS && this.strategyOptionsData) {
      this.createOrder(this.strategyOptionsData)
    }
  }

  public getAvailableChains(): Observable<string[]> {
    return this.availableChains.asObservable()
  }

  public getAvailableCoins(): Observable<string[]> {
    return this.availableCoins.asObservable()
  }

  public getAvailableWallets(): Observable<string[]> {
    return this.availableWallets.asObservable()
  }

  public getSelectedChain(): Observable<ChainType | undefined> {
    return this.selectedChain.asObservable()
  }

  public getSelectedStrategy(): Observable<StrategyType | undefined> {
    return this.selectedStrategy.asObservable()
  }

  public getSelectedTokenA(): Observable<CurrencyResponse | undefined> {
    return this.selectedCoinA.asObservable()
  }

  public getSelectedTokenB(): Observable<CurrencyResponse | undefined> {
    return this.selectedCoinB.asObservable()
  }

  public getSelectedWallet(): Observable<string | undefined> {
    return this.selectedWallet.asObservable()
  }

  public getShowCreateLoading(): Observable<boolean> {
    return this.showCreateLoading.asObservable()
  }

  public onSelectChain(chainAlias: string): void {
    const result = this.chainByAlias.get(chainAlias)

    if (result) {
      this.coinsByAlias.clear()
      this.availableCoins.next([])
    }

    this.selectedChain.next(result)
    this.canNext.next(result !== undefined)
  }

  public onSelectCoinB(coinAlias: string): void {
    const result = this.coinsByAlias.get(coinAlias)

    this.selectedCoinB.next(result)
    this.canNext.next(result !== undefined)
  }

  public onSelectWallet(walletAlias: string): void {
    const result = this.walletsByAlias.get(walletAlias)?.address

    this.selectedWallet.next(result)
    this.canNext.next(result !== undefined)
  }

  public onCreateWalletClick(): void {
    this.createWallet()
  }

  public onChangeOptions(data: StrategyOptionsData, isFullFilled: boolean): void {
    this.strategyOptionsData = data as ClassicScalpelOptionsData
    this.canNext.next(isFullFilled)
  }

  private async fetchCoins(): Promise<void> {
    try {
      this.showLoading.next(true)
      const coins = await this.currencyRepository.getCurrencies(this.selectedChain.value)

      const stable = coins.find(item => item.isStable)
      this.selectedCoinA.next(stable)

      coins.filter(item => !item.isStable)
        .forEach(item => {
          this.coinsByAlias.set(`(${item.symbol}) ${item.name}`, item)
        })

      this.availableCoins.next(Array.from(this.coinsByAlias.keys()))
    } catch (e) {
      console.error(e)

    } finally {
      this.showLoading.next(false)
    }
  }

  private async fetchWallets(): Promise<void> {
    try {
      this.showLoading.next(true)
      const wallets = await this.walletRepository.getWallets()

      wallets.forEach(item => {
        this.walletsByAlias.set(`${item.name ? `(${item.name}) ` : ' '}${AddressShortener(item.address)}`, item)
      })

      this.availableWallets.next(Array.from(this.walletsByAlias.keys()))
    } catch (e) {
      console.error(e)

    } finally {
      this.showLoading.next(false)
    }
  }

  private async createWallet(): Promise<void> {
    this.showLoading.next(true)
    try {
      await this.walletRepository.createWallet()
      await this.fetchWallets()
    } catch (e) {
      console.error(e)
    } finally {
      this.showLoading.next(false)
    }
  }

  private async createOrder(data: ClassicScalpelOptionsData): Promise<void> {
    try {
      this.showCreateLoading.next(true)
      this.canNext.next(false)

      if (this.selectedChain.value &&
        (this.isSimulation.value || (!this.isSimulation.value && this.selectedWallet.value)) &&
        this.selectedCoinA.value &&
        this.selectedCoinB.value &&
        data.tokenAmountA &&
        data.growDiffPercentsUp &&
        data.growDiffPercentsDown &&
        (this.isSimulation.value || (!this.isSimulation.value && data.maxGasPriceGwei)) &&
        this.strategyOptionsData
      ) {

        await this.strategyRepository.createStrategy(new CreateScalpelStrategyRequest(
          StrategyType.CLASSIC_SCALPEL,
          this.selectedChain.value,
          this.selectedWallet.value ?? '0x0',
          this.selectedCoinA.value?.address,
          this.selectedCoinB.value?.address,
          data.tokenAmountA,
          data.growDiffPercentsUp,
          data.growDiffPercentsDown,
          data.buyMaxPrice,
          data.maxGasPriceGwei,
          data.stopLossPercents,
        ))
      }

      this.createStrategyRouter.openStrategiesPage()

    } catch (e) {
      console.error(e)

    } finally {
      this.canNext.next(false)
      this.showCreateLoading.next(false)
    }
  }
}
