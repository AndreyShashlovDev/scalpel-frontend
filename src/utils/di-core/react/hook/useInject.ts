import { useMemo } from 'react'
import { moduleManager, TokenType } from '../../di/Dependency.ts'
import { useCurrentModule } from './useCurrentModule.ts'

export function useInject<T>(token: TokenType<T>): T {
  const moduleClass = useCurrentModule()

  return useMemo(() => {
    try {
      return moduleManager.getService<T>(moduleClass, token)
    } catch (error) {
      console.error(`Error resolving dependency ${String(token)} from module ${moduleClass.name}:`, error)
      throw error
    }
  }, [moduleClass, token])
}
