import { moduleManager, ModuleType } from './Dependency.ts'

export const preloadModule = async (moduleClass: ModuleType, isRootModule: boolean): Promise<void> => {
  if (moduleManager.isModuleLoaded(moduleClass)) {
    return;
  }

  if (isRootModule) {
    await moduleManager.loadRootModule(moduleClass);
  } else {
    await moduleManager.loadModule(moduleClass);
  }
}
