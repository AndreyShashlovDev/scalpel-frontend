import { Observable } from 'rxjs'
import { ChainType } from '../../../common/repository/data/model/ChainType.ts'
import { CurrencyResponse } from '../../../common/repository/data/model/CurrencyResponse.ts'
import { StrategyType } from '../../../common/repository/data/model/StrategyType.ts'
import { BasicPresenter } from '../../../utils/arch/BasicPresenter.ts'
import { StrategyOptionsData } from '../presentation/components/strategy-options/StrategyOptionsProps.ts'
import { State } from './CreateStrategyPagePresenterImpl.ts'

export abstract class CreateStrategyPagePresenter extends BasicPresenter {

  public abstract getCurrentState(): Observable<State>

  public abstract getAvailableChains(): Observable<string[]>

  public abstract getAvailableCoins(): Observable<string[]>

  public abstract getAvailableWallets(): Observable<string[]>

  public abstract getSelectedStrategy(): Observable<StrategyType | undefined>

  public abstract getSelectedChain(): Observable<ChainType | undefined>

  public abstract getSelectedTokenA(): Observable<CurrencyResponse | undefined>

  public abstract getSelectedTokenB(): Observable<CurrencyResponse | undefined>

  public abstract getSelectedWallet(): Observable<string | undefined>

  public abstract isCanShowLoading(): Observable<boolean>

  public abstract isCanNext(): Observable<boolean>

  public abstract getShowCreateLoading(): Observable<boolean>

  public abstract onClickNext(): void

  public abstract onSelectChain(chainAlias: string): void

  public abstract onSelectCoinB(coinAlias: string): void

  public abstract onSelectWallet(walletAlias: string): void

  public abstract onCreateWalletClick(): void

  public abstract onChangeOptions(data: StrategyOptionsData, isFullFilled: boolean): void
}
