import { useLayoutEffect } from 'react'
import { RouterNavigateOptions, To } from 'react-router-dom'
import { AppModule } from '../../AppModule.ts'
import { moduleManager } from '../../utils/di-core/di/Dependency.ts'
import { ApplicationRouter } from './domain/ApplicationRouter.ts'
import { NavigatorOptions } from './domain/BasicRouter.ts'

export interface RouterInitializerProps {
  router: {
    navigate(to: number): Promise<void>;
    navigate(to: To | null, opts?: RouterNavigateOptions): Promise<void>;
  }
}

export const RouterInitializer = ({router}: RouterInitializerProps) => {
  const adapter = moduleManager.getService<ApplicationRouter>(AppModule, ApplicationRouter)

  useLayoutEffect(() => {
    const nav = (routeOrDelta: string | number, options?: NavigatorOptions) => {
      if (typeof routeOrDelta === 'number') {
        router.navigate(routeOrDelta)
      } else {
        router.navigate(routeOrDelta, {
          replace: options?.replace,
          state: options?.state
        })
      }
    }

    adapter.setNavigate(nav)
  }, [router, adapter])
  return <></>
}
