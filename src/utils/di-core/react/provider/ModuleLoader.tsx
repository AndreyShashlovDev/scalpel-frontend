import { FC, ReactNode, Suspense } from 'react'
import { ModuleContext } from './ModuleContext.ts'
import { ModuleType } from '../../di/Dependency.ts'
import DefaultErrorBoundary from '../router/DefaultErrorBoundary.tsx'
import { DefaultError } from '../router/DefaultErrorView.tsx'
import { DefaultLoading } from '../router/DefaultLoadingView.tsx'
import { ModuleGuard } from '../router/ModuleGuard.tsx'

export interface AppModuleLoaderProps {
  module: ModuleType;
  children: ReactNode;
  LoadingComponent?: FC
  ErrorComponent?: FC
  isRootModule?: boolean,
}

export function RootModuleLoader({
  module,
  children,
  LoadingComponent = DefaultLoading,
  ErrorComponent = DefaultError,
}: AppModuleLoaderProps) {
  return ModuleLoader({module, children, LoadingComponent, ErrorComponent, isRootModule: true})
}

export function ModuleLoader({
  module,
  children,
  LoadingComponent = DefaultLoading,
  ErrorComponent = DefaultError,
  isRootModule = false,
}: AppModuleLoaderProps) {

  return (
    <DefaultErrorBoundary fallback={<ErrorComponent />}>
      <Suspense fallback={<LoadingComponent />}>
        <ModuleGuard
          module={module}
          LoadingComponent={LoadingComponent}
          ErrorComponent={ErrorComponent}
          isRootModule={isRootModule}
        >
          <ModuleContext.Provider value={{moduleClass: module}}>
          {children}
          </ModuleContext.Provider>
        </ModuleGuard>
      </Suspense>
    </DefaultErrorBoundary>
  )
}
