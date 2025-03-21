import { createContext } from 'react'
import { ModuleType } from '../../di/Dependency.ts'

interface ModuleContextValue {
  moduleClass: ModuleType
}

export const ModuleContext = createContext<ModuleContextValue | null>(null)
