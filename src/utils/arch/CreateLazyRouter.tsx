import { LazyExoticComponent, Suspense, useEffect, useState } from 'react'
import { EntrypointView } from '../../common/router/EntrypointView.tsx'
import ErrorBoundary from '../../common/router/ErrorBoundary.tsx'
import { PageNotLoadedView } from '../../common/router/PageNotLoadedView.tsx'
import { Abstract, injectionKernel, Newable } from '../../Injections.ts'

export function createLazyRoute({
  path,
  moduleLoader,
  presenterType,
  component: Component
}: {
  path: string
  moduleLoader: () => Promise<void>
  presenterType: Newable<unknown> | Abstract<unknown>
  component: LazyExoticComponent<() => JSX.Element>
}) {
  const LazyRouteComponent = (props: object) => {
    const [state, setState] = useState<{
      isLoading: boolean
      error: Error | null
    }>({
      isLoading: true,
      error: null
    })

    useEffect(() => {
      let mounted = true

      const loadModuleAsync = async () => {
        try {
          await moduleLoader()

          if (!mounted) {
            return
          }

          if (!injectionKernel.has(presenterType)) {
            throw new Error(`Presenter ${presenterType.toString()} not found after module loaded`)
          }

          setState({
            isLoading: false,
            error: null
          })
        } catch (error) {
          if (!mounted) {
            return
          }

          console.error('Error loading module:', error)
          setState({
            isLoading: false,
            error: error instanceof Error ? error : new Error(String(error))
          })
        }
      }

      loadModuleAsync()

      return () => {
        mounted = false
      }
    }, [])

    if (state.isLoading) {
      return <EntrypointView />
    }

    if (state.error) {
      return <PageNotLoadedView /*error={state.error}*/ />
    }

    return <Component {...props} />
  }

  return {
    path,
    element: (
      <ErrorBoundary fallback={<PageNotLoadedView />}>
        <Suspense fallback={<EntrypointView />}>
          <LazyRouteComponent />
        </Suspense>
      </ErrorBoundary>
    )
  }
}
