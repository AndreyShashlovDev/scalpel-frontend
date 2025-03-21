import { ComponentType, FC, LazyExoticComponent, Suspense } from 'react'
import { ModuleType } from '../../di/Dependency.ts'
import { ModuleProvider } from '../provider/ModuleProvider.tsx'
import DefaultErrorBoundary from './DefaultErrorBoundary.tsx'
import { DefaultError } from './DefaultErrorView.tsx'
import { DefaultLoading } from './DefaultLoadingView.tsx'
import { ModuleGuard } from './ModuleGuard.tsx'

interface ModuleRouteParams {
  path: string
  module: ModuleType
  component: LazyExoticComponent<ComponentType<unknown>>
  LoadingComponent?: FC
  ErrorComponent?: FC
}

export function createModuleRoute({
    path,
    module,
    component: Component,
    LoadingComponent = DefaultLoading,
    ErrorComponent = DefaultError,
  }: ModuleRouteParams
) {
  return {
    path,
    element: (
      <DefaultErrorBoundary fallback={<ErrorComponent />}>
        <Suspense fallback={<LoadingComponent />}>
          <ModuleGuard
            key={path}
            module={module}
            LoadingComponent={LoadingComponent}
            ErrorComponent={ErrorComponent}
            isRootModule={false}
          >
            <ModuleProvider module={module}>
              <Component />
            </ModuleProvider>
          </ModuleGuard>
        </Suspense>
      </DefaultErrorBoundary>
    )
  }
}
