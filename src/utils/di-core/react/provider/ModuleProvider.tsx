import { ReactNode, useEffect } from 'react'
import { ModuleContext } from './ModuleContext.ts'
import { moduleManager, ModuleType } from '../../di/Dependency.ts'

interface ModuleProviderProps {
  module: ModuleType;
  children: ReactNode;
}

export const ModuleProvider = ({module, children}: ModuleProviderProps) => {
  useEffect(() => {
    let mounted = true

    const loadModuleAsync = async () => {
      try {
        if (!moduleManager.isModuleLoaded(module)) {
          await moduleManager.loadModule(module)
        }
      } catch (error) {
        if (mounted) {
          console.error(`Error loading module ${module.name}:`, error)
        }
      }
    }

    loadModuleAsync()

    return () => {
      mounted = false
    }
  }, [module])

  return (
    <ModuleContext.Provider value={{moduleClass: module}}>
      {children}
    </ModuleContext.Provider>
  )
}
