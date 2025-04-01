import { useMemo } from 'react'
import { moduleManager, TokenType } from '../../di/Dependency.ts'
import { useCurrentModule } from './useCurrentModule.ts'

export function useInject<T>(token: TokenType<T>): T {
  const moduleClass = useCurrentModule()

  return useMemo(() => moduleManager.getService<T>(moduleClass, token), [moduleClass, token])
}
