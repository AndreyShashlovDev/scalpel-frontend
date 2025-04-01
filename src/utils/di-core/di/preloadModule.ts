import { moduleManager, ModuleType } from './Dependency.ts'

export const preloadModule = async (moduleClass: ModuleType, isRootModule: boolean): Promise<void> => {
  moduleManager.registerModuleHierarchy(moduleClass)

  if (isRootModule) {
    await moduleManager.loadRootModule(moduleClass)
  } else {
    await moduleManager.loadModule(moduleClass)
  }
}
