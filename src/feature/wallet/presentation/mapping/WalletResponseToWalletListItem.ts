import BigNumber from 'bignumber.js'
import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { CurrencyResponse } from '../../../../common/repository/data/model/CurrencyResponse.ts'
import { WalletStatisticResponse } from '../../../../common/repository/data/model/WalletStatisticResponse.ts'
import { ChainNativeCurrency, WeiToEth } from '../../../../utils/ChainsData.ts'
import { NumberShortener } from '../../../../utils/Shortener.ts'
import { Address } from '../../../../utils/types.ts'
import { WalletCurrencyUiModel, WalletListItemModel } from '../model/WalletListItemModel.ts'

export const WalletResponseToWalletListItem = (
  response: WalletStatisticResponse,
  actualAmount: Map<ChainType, Map<Address, BigNumber>>,
  currencyPrices: Map<ChainType, Map<Address, CurrencyResponse>>
) => {
  const fees = new Map(Object.keys(response.txFee)
    .map(key => {
      // @ts-expect-error not error
      const chain = ChainType[key]
      const wrapped = ChainNativeCurrency.get(chain)?.wrapped ?? '0x'
      const nativeCurrency = currencyPrices.get(chain)?.get(wrapped)
      // @ts-expect-error not error
      const nativeEthFee = WeiToEth(response.txFee[chain])

      const usdPrice = nativeCurrency?.price && wrapped
        ? new BigNumber(nativeCurrency?.price.usdtPrice ?? '0').div(new BigNumber(10).pow(6))
          .multipliedBy(nativeEthFee)
          .toNumber()

        : undefined

      return [chain, {eth: nativeEthFee, usd: usdPrice}]
    }))

  const currencies = response.currencies.reduce(
    (acc, curr) => {
      const itemsByChain = acc.get(curr.currency.chain) ?? []
      const totalBalance = actualAmount.get(curr.currency.chain)?.get(curr.currency.address)

      const model = new WalletCurrencyUiModel(
        curr.currency,
        NumberShortener(curr.currency.valueTo(curr.amount)),
        totalBalance ? NumberShortener(curr.currency.valueTo(totalBalance.toString())) : undefined,
      )
      itemsByChain.push(model)

      return acc.set(curr.currency.chain, itemsByChain)
    },
    new Map<ChainType, WalletCurrencyUiModel[]>()
  )

  const totalUsdAmounts = Array.from(currencies.entries()).reduce((acc, curr) => {
    const [chain, items] = curr
    const sum = items.reduce((total, currency) => total + currency.usdAmount, 0)

    return acc.set(chain, NumberShortener(sum))
  }, new Map<ChainType, number>)

  const totalActualUsdAmounts = Array.from(currencies.entries()).reduce((acc, curr) => {
    const [chain, items] = curr
    const hasUnknown = items.find(item => item.actualUsdAmount === undefined)

    if (hasUnknown) {
      return acc.set(chain, undefined)
    }

    const sum = items.reduce((total, currency) => total + (currency.actualUsdAmount ?? 0), 0)

    return acc.set(chain, NumberShortener(sum))
  }, new Map<ChainType, number | undefined>)

  return new WalletListItemModel(
    response.address,
    response.name,
    response.totalOrders,
    response.activeOrders,
    response.totalUsdProfit,
    fees,
    currencies,
    totalUsdAmounts,
    totalActualUsdAmounts,
  )
}
