import { CurrencyRepository } from './common/repository/data/currencies/CurrencyRepository.ts'
import { CurrencyRepositoryImpl } from './common/repository/data/currencies/CurrencyRepositoryImpl.ts'
import { AppAuthHttpsService } from './common/repository/data/source/AppAuthHttpsService.ts'
import { AppSourceService } from './common/repository/data/source/AppSourceService.ts'
import { ApplicationRouter } from './common/router/domain/ApplicationRouter.ts'
import { ApplicationRouterImpl } from './common/router/domain/ApplicationRouterImpl.ts'
import { AppAuthService } from './common/service/auth/AppAuthService.ts'
import { AppAuthServiceImpl } from './common/service/auth/AppAuthServiceImpl.ts'
import { AppExceptionHandlerService } from './common/service/exception-handler/AppExceptionHandlerService.ts'
import { ExceptionHandlerService } from './common/service/exception-handler/ExceptionHandlerService.ts'
import { ExceptionNotifierService } from './common/service/exception-handler/ExceptionNotifierService.ts'
import { WalletConnect } from './common/service/wallet-connect/WalletConnect.ts'
import { WalletConnectImpl } from './common/service/wallet-connect/WalletConnectImpl.ts'

export class Factory<T> {

  private readonly creator: () => T
  private readonly singleton: boolean

  constructor(creator: () => T, singleton: boolean) {
    this.creator = creator
    this.singleton = singleton
  }

  public create(): T {
    return this.creator()
  }

  public isSingleton(): boolean {
    return this.singleton
  }
}

type Newable<T> = new (...args: unknown[]) => T

interface Abstract<T> {
  prototype: T
}

export const injectionKernel = new Map<Newable<unknown> | Abstract<unknown>, Factory<unknown>>()
const mapSingleton = new Map<Newable<unknown> | Abstract<unknown>, unknown>()

const initValue = <T>(qualifier: Newable<unknown> | Abstract<unknown>): T => {
  if (injectionKernel.has(qualifier) && !mapSingleton.has(qualifier)) {
    const factory = injectionKernel.get(qualifier)!
    const result: T = factory?.create() as T

    if (factory.isSingleton()) {
      mapSingleton.set(qualifier, result)
    }
    return result
  } else if (!injectionKernel.has(qualifier)) {
    throw new Error(`${qualifier} not implemented`)
  }

  const value = mapSingleton.get(qualifier) as T

  return value as unknown as T
}

export const getDIValue = <T>(qualifier: Newable<T> | Abstract<T>): T => initValue(qualifier)

export const useInject = <T>(qualifier: Newable<T> | Abstract<T>): T => initValue(qualifier)

const SCALPEL_ENDPOINT = import.meta.env.VITE_SCALPEL_ENDPOINT ?? ''
export const IS_PRODUCTION = import.meta.env.PROD

const exceptionService = new AppExceptionHandlerService()

injectionKernel.set(ExceptionHandlerService, new Factory(() => exceptionService, true))
injectionKernel.set(ExceptionNotifierService, new Factory(() => exceptionService, true))

injectionKernel.set(AppAuthService, new Factory(() => new AppAuthServiceImpl(), true))

injectionKernel.set(
  AppSourceService,
  new Factory(
    () => new AppSourceService(new AppAuthHttpsService(
      SCALPEL_ENDPOINT,
      'api',
      getDIValue(AppAuthService),
      getDIValue(ExceptionNotifierService)
    )),
    true
  )
)

injectionKernel.set(
  CurrencyRepository,
  new Factory(() => new CurrencyRepositoryImpl(getDIValue(AppSourceService)), true)
)
injectionKernel.set(ApplicationRouter, new Factory(() => new ApplicationRouterImpl(), true))
injectionKernel.set(WalletConnect, new Factory(() => new WalletConnectImpl('882d3398012401b6a598b7a245adff21'), true))
