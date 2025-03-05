export type Newable<T> = new (...args: unknown[]) => T

export interface Abstract<T> {
  prototype: T
}

export interface InjectionModule {
  invokeInject?: () => void
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
