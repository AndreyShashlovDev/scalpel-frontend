import { moduleManager, ModuleType } from './Dependency.ts'

export const preloadModule = async (moduleClass: ModuleType, isRootModule: boolean): Promise<void> => {
  await moduleManager.loadModule(moduleClass, isRootModule)
}
