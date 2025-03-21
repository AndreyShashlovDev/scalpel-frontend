import { useContext } from 'react'
import { ModuleContext } from '../provider/ModuleContext.ts'
import { ModuleType } from '../../di/Dependency.ts'

export function useCurrentModule(): ModuleType {
  const context = useContext(ModuleContext)

  if (!context) {
    throw new Error('useCurrentModule must be used within ModuleProvider')
  }
  return context.moduleClass
}
