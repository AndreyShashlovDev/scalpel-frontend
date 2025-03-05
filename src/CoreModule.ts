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
import { Factory, getDIValue, injectionKernel, Singleton } from './utils/arch/Injections.ts'

const SCALPEL_ENDPOINT = import.meta.env.VITE_SCALPEL_ENDPOINT || window.location.origin
export const REOWN_PROJECT_ID = '882d3398012401b6a598b7a245adff21'
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
