import { AuthRepositoryImpl } from './common/repository/data/auth-repository/AuthRepositoryImpl.ts'
import { CurrencyRepository } from './common/repository/data/currencies/CurrencyRepository.ts'
import { CurrencyRepositoryImpl } from './common/repository/data/currencies/CurrencyRepositoryImpl.ts'
import { PreferencesRepository } from './common/repository/data/preferences/PreferencesRepository.ts'
import { PreferencesRepositoryImpl } from './common/repository/data/preferences/PreferencesRepositoryImpl.ts'
import { AppAuthHttpsService } from './common/repository/data/source/AppAuthHttpsService.ts'
import { AppSourceService } from './common/repository/data/source/AppSourceService.ts'
import { AppSourceServiceImpl } from './common/repository/data/source/AppSourceServiceImpl.ts'
import { ApplicationRouter } from './common/router/domain/ApplicationRouter.ts'
import { ApplicationRouterImpl } from './common/router/domain/ApplicationRouterImpl.ts'
import { AppAuthService } from './common/service/auth/AppAuthService.ts'
import { AppAuthServiceImpl } from './common/service/auth/AppAuthServiceImpl.ts'
import { AppExceptionHandlerService } from './common/service/exception-handler/AppExceptionHandlerService.ts'
import { ExceptionHandlerService } from './common/service/exception-handler/ExceptionHandlerService.ts'
import { ExceptionNotifierService } from './common/service/exception-handler/ExceptionNotifierService.ts'

export type Newable<T> = new (...args: unknown[]) => T

export interface Abstract<T> {
  prototype: T
}

export interface InjectionModule {
  invokeInject: () => void
}

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

export class Singleton<T> extends Factory<T> {
  constructor(creator: () => T) {
    super(creator, true)
  }
}

export const injectionKernel = new Map<Newable<unknown> | Abstract<unknown>, Factory<unknown>>()
const mapSingleton = new Map<Newable<unknown> | Abstract<unknown>, unknown>()

export const getDIValue = <T>(qualifier: Newable<T> | Abstract<T>): T => {
  if (mapSingleton.has(qualifier)) {
    return mapSingleton.get(qualifier) as T
  }

  if (!injectionKernel.has(qualifier)) {
    throw new Error(`${qualifier.toString()} not implemented`)
  }

  const factory = injectionKernel.get(qualifier)!
  const result = factory.create()

  if (factory.isSingleton()) {
    mapSingleton.set(qualifier, result)
  }

  return result as T
}

export const destroyDiInstance = <T>(qualifier: Newable<T> | Abstract<T>): boolean => {
  return mapSingleton.delete(qualifier)
}

export type ModuleRegistrator = () => void;

const loadedModules = new Set<ModuleRegistrator>()
const loadingModules = new Map<ModuleRegistrator, Promise<void>>()

export const loadModule = async (moduleRegistrator: ModuleRegistrator): Promise<void> => {
  if (loadedModules.has(moduleRegistrator)) {
    return
  }

  if (loadingModules.has(moduleRegistrator)) {
    return loadingModules.get(moduleRegistrator)
  }

  const loadPromise = Promise.resolve().then(() => moduleRegistrator())
  loadingModules.set(moduleRegistrator, loadPromise)

  try {
    await loadPromise
    loadedModules.add(moduleRegistrator)
    loadingModules.delete(moduleRegistrator)
  } catch (error) {
    loadingModules.delete(moduleRegistrator)
    throw error
  }
}

export const isModuleLoaded = (moduleRegistrator: ModuleRegistrator): boolean => {
  return loadedModules.has(moduleRegistrator)
}

const SCALPEL_ENDPOINT = import.meta.env.VITE_SCALPEL_ENDPOINT || window.location.origin
export const IS_PRODUCTION = import.meta.env.PROD
console.log(`Build version: ${process.env.VITE_BUILD_NUMBER}`)

injectionKernel.set(
  PreferencesRepository,
  new Singleton(() => new PreferencesRepositoryImpl())
)

const exceptionService = new AppExceptionHandlerService()

injectionKernel.set(ExceptionHandlerService, new Factory(() => exceptionService, true))
injectionKernel.set(ExceptionNotifierService, new Factory(() => exceptionService, true))

const appAuthSourceService = new AppAuthHttpsService(
  SCALPEL_ENDPOINT,
  'api',
)

injectionKernel.set(
  AppSourceService,
  new Singleton(
    () => new AppSourceServiceImpl(appAuthSourceService, getDIValue(ExceptionNotifierService))
  )
)

injectionKernel.set(
  AppAuthService,
  new Singleton(
    () => new AppAuthServiceImpl(appAuthSourceService, new AuthRepositoryImpl(getDIValue(AppSourceService)))
  )
)

injectionKernel.set(
  CurrencyRepository,
  new Factory(() => new CurrencyRepositoryImpl(getDIValue(AppSourceService)), true)
)

injectionKernel.set(ApplicationRouter, new Factory(() => new ApplicationRouterImpl(), true))
