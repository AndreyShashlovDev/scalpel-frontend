import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { moduleManager, ModuleType } from '../../di/Dependency.ts'
import { preloadModule } from '../../di/preloadModule.ts'
import { DefaultError } from './DefaultErrorView.tsx'
import { DefaultLoading } from './DefaultLoadingView.tsx'

export const ModuleGuard = ({
  module,
  children,
  LoadingComponent = DefaultLoading,
  ErrorComponent = DefaultError,
  isRootModule = false,
}: {
  module: ModuleType
  children: ReactNode
  LoadingComponent: FC
  ErrorComponent: FC
  isRootModule: boolean
}) => {
  const isLoading = useRef<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(moduleManager.isModuleLoaded(module))
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (isLoading.current) {
      return
    }

    let isMounted = true
    isLoading.current = true

    preloadModule(module, isRootModule)
      .then(() => {setIsLoaded(true)})
      .catch(err => {
        setIsLoaded(false)

        if (isMounted) {
          console.error('Error loading module:', err)
          setError(err instanceof Error ? err : new Error(String(err)))
        }
      })

    return () => {
      isMounted = false
      setIsLoaded(false)
      isLoading.current = false

      moduleManager.unloadModule(module)
    }
  }, [module])

  if (error) {
    return <ErrorComponent />
  }

  if (!isLoaded) {
    return <LoadingComponent />
  }

  return <>{children}</>
}
