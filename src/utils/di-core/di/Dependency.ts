import { container, DependencyContainer, InjectionToken } from 'tsyringe'
import 'reflect-metadata'
import { constructor } from 'tsyringe/dist/typings/types'

const MODULE_METADATA_KEY = Symbol('moduleMetadata')

const debugLog = (...args: unknown[]) => {
  // console.debug(...args)
  if (args) {
    //ssdsd
  }
}

export interface Abstract<T> {
  prototype: T;
}

export type TokenType<T> = Abstract<T> | InjectionToken<T>

export interface ModuleClassProvider<T = unknown> {
  provide: TokenType<T>;
  useClass: constructor<T>;
}

export interface ModuleValueProvider<T = unknown> {
  provide: TokenType<T>;
  useValue: T;
}

export interface ModuleFactoryProvider<T = unknown> {
  provide: TokenType<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory: (...args: any[]) => T | Promise<T>;
  deps?: TokenType<unknown>[];
}

export interface ModuleTokenProvider<T = unknown, U = unknown> {
  provide: TokenType<T>;
  useToken: InjectionToken<U>;
}

export interface ModuleOptions {
  imports?: ModuleType[];
  providers?: ProviderOptions[];
  exports?: TokenType<unknown>[];
  global?: boolean;
}

export type ProviderOptions =
  | ModuleClassProvider
  | ModuleValueProvider
  | ModuleFactoryProvider
  | ModuleTokenProvider

export interface ModuleType {
  new(...args: unknown[]): unknown;
}

export const resolveNameProvider = (token: TokenType<unknown>): InjectionToken => {
  // @ts-expect-error isOk
  if (typeof token === 'function' || ('prototype' in token)) {
    const actualToken = typeof token === 'function'
      ? token.name
      : (token as Abstract<unknown>).constructor.name

    debugLog(`Resolving token by name: ${actualToken}`)
    return actualToken
  }

  return token
}

export class ModuleRef {
  options: ModuleOptions
  imports: ModuleRef[] = []
  container: DependencyContainer
  initialized = false
  initializing = false
  public providerCache = new Map<string | symbol, unknown>()
  public exportCache = new Set<string | symbol>()
  public parentModule?: ModuleRef
  public moduleClass?: ModuleType

  constructor(options: ModuleOptions, parentContainer?: DependencyContainer) {
    this.options = options
    this.container = parentContainer?.createChildContainer() || container.createChildContainer()
  }

  public isGlobal(): boolean {
    return !!this.options.global
  }

  public setParentModule(parentModule: ModuleRef): void {
    this.parentModule = parentModule
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }

    if (this.initializing) {
      await new Promise<void>(resolve => {
        const checkInterval = setInterval(() => {
          if (!this.initializing) {
            clearInterval(checkInterval)
            resolve()
          }
        }, 10)
      })
      return
    }

    this.initializing = true

    try {
      if (this.options.imports?.length) {
        await Promise.all(
          this.options.imports.map(async importedModule => {
            debugLog(`Module ${importedModule.name} being imported in init`)
            const existingModuleRef = moduleManager.getLoadedModuleRef(importedModule)

            if (existingModuleRef && existingModuleRef.initialized) {
              debugLog(`Module ${importedModule.name} already initialized, reusing`)
              this.imports.push(existingModuleRef)

              await this.importExportedTokens(existingModuleRef, importedModule)

            } else {
              await moduleManager.loadModule(importedModule)
              const moduleRef = moduleManager.getLoadedModuleRef(importedModule)

              if (moduleRef) {
                this.imports.push(moduleRef)
                await this.importExportedTokens(moduleRef, importedModule)
              }
            }
          })
        )
      }

      if (this.options.providers?.length) {
        for (const provider of this.options.providers) {
          await this.registerProvider(provider)
        }
      }

      this.initialized = true
    } finally {
      this.initializing = false
    }
  }

  private async importExportedTokens(sourceModuleRef: ModuleRef, sourceModule: ModuleType): Promise<void> {
    debugLog(`Importing tokens from ${sourceModule.name}`)

    if (sourceModuleRef.options.exports?.length) {
      for (const token of sourceModuleRef.options.exports) {
        const actualToken = resolveNameProvider(token)

        debugLog(`Checking export token: ${String(actualToken)}`)

        try {
          const instance = sourceModuleRef.resolveToken(actualToken)
          debugLog(`Resolved exported token ${String(actualToken)} from module ${sourceModule.name}`)

          this.container.register(actualToken, {useValue: instance})
        } catch (error) {
          debugLog(error)
          console.warn(`Failed to resolve exported token ${String(actualToken)} from module ${sourceModule.name}`)
        }
      }
    }

    if (sourceModuleRef.options.exports) {
      for (const exportedItem of sourceModuleRef.options.exports) {
        const exportedModule = moduleManager.getModuleClassByName(String(exportedItem))

        if (exportedModule) {
          debugLog(`Importing nested module: ${exportedModule.name} from ${sourceModule.name}`)
          const nestedModuleRef = moduleManager.getLoadedModuleRef(exportedModule)

          if (nestedModuleRef) {
            await this.importExportedTokens(nestedModuleRef, exportedModule)
          } else {
            console.warn(`Module ${exportedModule.name} is exported but not loaded`)
          }
        }
      }
    }
  }

  public resolveToken<T>(token: InjectionToken): T {
    const tokenKey = typeof token === 'string' || typeof token === 'symbol'
      ? token
      : String(token)

    if (this.providerCache.has(tokenKey)) {
      return this.providerCache.get(tokenKey) as T
    }

    try {
      const instance = this.container.resolve<T>(token)
      this.providerCache.set(tokenKey, instance)

      return instance

    } catch (error) {
      if (this.parentModule) {
        try {
          return this.parentModule.resolveToken<T>(token)
        } catch (e) {
          debugLog(e)
        }
      }

      throw error
    }
  }

  private async registerProvider(provider: ProviderOptions): Promise<void> {
    const provide = provider.provide
    const provideKey = resolveNameProvider(provide)
    const tokenKey = typeof provideKey === 'string' || typeof provideKey === 'symbol'
      ? provideKey
      : String(provideKey)

    debugLog(`Registering provider: ${String(provideKey)}`)

    if (this.providerCache.has(tokenKey)) {
      debugLog(`Provider ${String(provideKey)} found in module cache, reusing instance`)
      this.container.register(provideKey, {useValue: this.providerCache.get(tokenKey)})
      return
    }

    if (this.container.isRegistered(provideKey, false)) {
      try {
        const existing = this.container.resolve(provideKey)
        debugLog(`Provider ${String(provideKey)} already registered in container, reusing instance`)
        this.providerCache.set(tokenKey, existing)
        return
      } catch (error) {
        debugLog(error)
        debugLog(`Provider ${String(provideKey)} registered but failed to resolve, re-registering...`)
      }
    } else {
      debugLog(`Provider ${String(provideKey)} not found, registering...`)
    }

    let instance: unknown

    if ('useValue' in provider) {
      instance = provider.useValue
      this.container.register(provideKey, {useValue: provider.useValue})

    } else if ('useClass' in provider) {
      try {
        instance = container.resolve(provider.useClass)
        debugLog(`Found singleton instance of ${provider.useClass.name} in root container`)
        this.container.register(provideKey, {useValue: instance})

      } catch {
        this.container.register(provideKey, {useClass: provider.useClass})
        instance = this.container.resolve(provideKey)
      }

    } else if ('useToken' in provider) {
      const tokenKey = resolveNameProvider(provider.useToken)

      try {
        const tokenInstance = this.resolveToken(tokenKey)
        this.container.register(provideKey, {useValue: tokenInstance})
        instance = tokenInstance
      } catch (e) {
        debugLog(e)
        this.container.register(provideKey, {useToken: provider.useToken})
        instance = this.container.resolve(provideKey)
      }

    } else if ('useFactory' in provider) {
      const deps = provider.deps || []
      const resolvedDeps = deps.map(dep => {
        const depKey = resolveNameProvider(dep)
        debugLog(`get dep: ${String(depKey)}`)

        try {
          return this.resolveToken(depKey)
        } catch (error) {
          console.error(`Error resolving dependency ${String(dep)} for factory provider ${String(provideKey)}:`, error)
          throw error
        }
      })

      const result = provider.useFactory(...resolvedDeps)

      if (result instanceof Promise) {
        instance = await result
        this.container.register(provideKey, {useValue: instance})
      } else {
        instance = result
        this.container.register(provideKey, {useValue: result})
      }
    }

    if (instance !== undefined) {
      this.providerCache.set(tokenKey, instance)

      if (this.options.exports?.some(exp => {
        const exportToken = resolveNameProvider(exp)
        return String(exportToken) === String(provideKey)
      })) {
        this.exportCache.add(tokenKey)
      }

      return
    }

    try {
      const resolvedInstance = this.container.resolve(provideKey)
      debugLog(`Successfully registered ${String(provideKey)}, instance type: ${resolvedInstance.constructor.name}`)
    } catch (error) {
      console.error(`Failed to verify registration of ${String(provideKey)}:`, error)
    }
  }

  isTokenExported(token: InjectionToken): boolean {
    const tokenKey = typeof token === 'string' || typeof token === 'symbol'
      ? token
      : String(token)

    return this.exportCache.has(tokenKey) ||
      (this.options.exports?.some(exp => String(resolveNameProvider(exp)) === tokenKey) ?? false)
  }

  dispose(): void {
    this.initialized = false

    for (const importedModule of this.imports) {
      if (!importedModule.isGlobal()) {
        importedModule.dispose()
      }
    }

    this.imports = []
    this.providerCache.clear()
    this.exportCache.clear()
  }
}

export function Module(options: ModuleOptions): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return <TFunction extends Function>(target: TFunction): void => {
    const moduleRef = new ModuleRef(options)
    moduleRef.moduleClass = target as unknown as ModuleType
    Reflect.defineMetadata(MODULE_METADATA_KEY, moduleRef, target)
  }
}

export function getModuleRef(moduleClass: ModuleType): ModuleRef | undefined {
  return Reflect.getMetadata(MODULE_METADATA_KEY, moduleClass)
}

export class ModuleManager {
  public loadedModules = new Map<string, ModuleRef>()
  private initializedModuleRefs = new Map<string, ModuleRef>()
  private initializationPromises = new Map<string, Promise<void>>()
  private rootContainer: DependencyContainer | null = null
  private rootModuleClass: ModuleType | null = null
  private moduleClasses = new Map<string, ModuleType>()

  constructor() {
    this.rootContainer = container.createChildContainer()
  }

  public getServiceFromRoot<T>(token: TokenType<unknown>): T {
    if (!this.rootContainer) {
      throw new Error('Root container is not initialized')
    }

    const actualToken = resolveNameProvider(token)

    try {
      return this.rootContainer.resolve<T>(actualToken as InjectionToken<T>)

    } catch (e) {
      for (const moduleRef of this.loadedModules.values()) {
        if (moduleRef.isGlobal()) {
          try {
            return moduleRef.resolveToken<T>(actualToken)
          } catch {
            // ignore error and looking next for...
          }
        }
      }

      throw e
    }
  }

  public async loadRootModule<T>(moduleClass: ModuleType): Promise<T> {
    debugLog('Loading root module:', moduleClass.name)
    this.rootModuleClass = moduleClass
    this.registerModuleClass(moduleClass)

    const moduleRef = getModuleRef(moduleClass)
    if (!moduleRef) {
      throw new Error(`Module ${moduleClass.name} is not decorated with @Module`)
    }
    moduleRef.container = this.rootContainer!

    return this.loadModule(moduleClass)
  }

  public async loadModule<T>(moduleClass: ModuleType): Promise<T> {
    debugLog('load module', moduleClass.name)

    this.registerModuleClass(moduleClass)

    if (this.isModuleLoaded(moduleClass)) {
      debugLog(`Module ${moduleClass.name} already loaded`)
      return new moduleClass() as T
    }

    const existingPromise = this.initializationPromises.get(moduleClass.name)

    if (existingPromise) {
      debugLog(`Module ${moduleClass.name} is already being initialized, waiting...`)
      await existingPromise
      return new moduleClass() as T
    }

    const moduleRef = getModuleRef(moduleClass)
    if (!moduleRef) {
      throw new Error(`Module ${moduleClass.name} is not decorated with @Module`)
    }

    // check parent module
    const importingModules = this.findImportingModules(moduleClass)

    if (importingModules.length > 0) {
      const importingModuleRef = this.getLoadedModuleRef(importingModules[0])

      if (importingModuleRef) {
        moduleRef.container = importingModuleRef.container.createChildContainer()
        // setup parent module
        moduleRef.setParentModule(importingModuleRef)
        debugLog(`Module ${moduleClass.name} is imported by ${importingModules[0].name}, using parent container`)
      }
    } else if (
      moduleClass !== this.rootModuleClass &&
      this.rootModuleClass &&
      this.isModuleLoaded(this.rootModuleClass) &&
      this.rootContainer
    ) {
      moduleRef.container = this.rootContainer.createChildContainer()

      // setup root module as parent
      const rootModuleRef = this.getLoadedModuleRef(this.rootModuleClass)
      if (rootModuleRef) {
        moduleRef.setParentModule(rootModuleRef)
      }
    }

    const initPromise = this.initializeModule(moduleClass, moduleRef)
    this.initializationPromises.set(moduleClass.name, initPromise)

    try {
      await initPromise
      return new moduleClass() as T
    } finally {
      this.initializationPromises.delete(moduleClass.name)
    }
  }

  private registerModuleClass(moduleClass: ModuleType): void {
    this.moduleClasses.set(moduleClass.name, moduleClass)

    const moduleRef = getModuleRef(moduleClass)

    if (moduleRef && moduleRef.options.imports) {
      for (const importedModule of moduleRef.options.imports) {
        this.registerModuleClass(importedModule)
      }
    }
  }

  public getModuleClassByName(name: string): ModuleType | undefined {
    return this.moduleClasses.get(name)
  }

  private async initializeModule(moduleClass: ModuleType, moduleRef: ModuleRef): Promise<void> {
    await moduleRef.initialize()

    this.loadedModules.set(moduleClass.name, moduleRef)
    this.initializedModuleRefs.set(moduleClass.name, moduleRef)

    if (moduleRef.isGlobal() && this.rootContainer) {
      await this.registerGlobalProviders(moduleRef)
    }
  }

  private async registerGlobalProviders(moduleRef: ModuleRef): Promise<void> {
    debugLog(
      `Registering global providers from module with exports: ${
        moduleRef.options.exports?.map(e => String(e)).join(', ')
      }`
    )

    if (!moduleRef.options.exports || !this.rootContainer) {
      return
    }

    for (const token of moduleRef.options.exports) {
      const actualToken = resolveNameProvider(token)

      const exportedModule = this.moduleClasses.get(String(token))

      if (exportedModule) {
        debugLog(`Found exported module: ${exportedModule.name}`)
        const exportedModuleRef = this.getLoadedModuleRef(exportedModule)

        if (exportedModuleRef && exportedModuleRef.options.exports) {
          debugLog(`Registering exported tokens from module ${exportedModule.name}`)

          for (const nestedToken of exportedModuleRef.options.exports) {
            try {
              const nestedActualToken = resolveNameProvider(nestedToken)
              const nestedInstance = exportedModuleRef.resolveToken(nestedActualToken)

              debugLog(`Registering nested token: ${String(nestedActualToken)}`)

              try {
                this.rootContainer.resolve(nestedActualToken)
                debugLog(`Token ${String(nestedActualToken)} already in root container`)
              } catch {
                this.rootContainer.register(nestedActualToken, {useValue: nestedInstance})
                debugLog(`Registered ${String(nestedActualToken)} in root container`)
              }
            } catch (error) {
              debugLog(error)
              console.warn(`Failed to register nested token: ${String(nestedToken)}`)
            }
          }
        }
        continue
      }

      try {
        const instance = moduleRef.resolveToken(actualToken)

        try {
          this.rootContainer.resolve(actualToken)
          debugLog(`Token ${String(actualToken)} already in root container`)
        } catch {
          this.rootContainer.register(actualToken, {useValue: instance})
          debugLog(`Registered token ${String(actualToken)} in root container`)
        }
      } catch (error) {
        debugLog(error)
        console.warn(`Failed to register token: ${String(actualToken)}`)
      }
    }
  }

  public getLoadedModuleRef(moduleClass: ModuleType): ModuleRef | undefined {
    return this.loadedModules.get(moduleClass.name)
  }

  public getService<T>(moduleClass: ModuleType, token: TokenType<unknown>): T {
    const moduleRef = this.getModuleRefOrThrow(moduleClass)
    const actualToken = resolveNameProvider(token)

    try {
      return moduleRef.resolveToken<T>(actualToken)
    } catch (error) {

      for (const globalModuleRef of this.loadedModules.values()) {
        if (globalModuleRef.isGlobal() && globalModuleRef !== moduleRef) {
          try {
            const instance = globalModuleRef.resolveToken<T>(actualToken)

            if (globalModuleRef.isTokenExported(actualToken)) {
              return instance
            }
          } catch {
            // ignore error looking next
          }
        }
      }

      if (this.rootContainer) {
        try {
          return this.rootContainer.resolve<T>(actualToken)
        } catch {
          // ignore error
        }
      }

      console.error(`Could not resolve token ${String(actualToken)} in module ${moduleClass.name} or any global modules`)
      throw error
    }
  }

  public isModuleLoaded(moduleClass: ModuleType): boolean {
    return this.loadedModules.has(moduleClass.name) &&
      this.loadedModules.get(moduleClass.name)!.initialized
  }

  public isGlobalModule(moduleClass: ModuleType): boolean {
    const moduleRef = this.getLoadedModuleRef(moduleClass)
    return moduleRef ? moduleRef.isGlobal() : false
  }

  public unloadModule(moduleClass: ModuleType): void {
    debugLog(`Unloading module: ${moduleClass.name}`)

    const moduleRef = this.loadedModules.get(moduleClass.name)
    if (!moduleRef) {
      debugLog(`Cannot unload module ${moduleClass.name}: not found in loaded modules`)
      return
    }

    if (moduleRef.isGlobal()) {
      debugLog(`Skipping unload of global module: ${moduleClass.name}`)
      return
    }

    moduleRef.dispose()

    moduleRef.container.clearInstances()
    moduleRef.container.reset()
    moduleRef.container.dispose()

    this.loadedModules.delete(moduleClass.name)
    this.initializedModuleRefs.delete(moduleClass.name)

    debugLog(`Module ${moduleClass.name} unloaded successfully`)
  }

  private findImportingModules(moduleClass: ModuleType): ModuleType[] {
    const result: ModuleType[] = []

    for (const [name, moduleRef] of this.loadedModules.entries()) {
      if (moduleRef.options.imports?.some(imp => imp.name === moduleClass.name)) {
        const importingClass = this.moduleClasses.get(name)

        if (importingClass) {
          result.push(importingClass)
        }
      }
    }

    return result
  }

  private getModuleRefOrThrow(moduleClass: ModuleType): ModuleRef {
    const moduleRef = this.loadedModules.get(moduleClass.name)
    if (!moduleRef) {
      throw new Error(`Module ${moduleClass.name} not loaded`)
    }
    return moduleRef
  }
}

export const moduleManager = new ModuleManager()
