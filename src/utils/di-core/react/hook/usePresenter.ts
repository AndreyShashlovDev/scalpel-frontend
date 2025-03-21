import { useLayoutEffect, useMemo, useRef } from 'react'
import { BasicPresenter } from '../../../arch/BasicPresenter.ts'
import { moduleManager, TokenType } from '../../di/Dependency.ts'
import { useCurrentModule } from './useCurrentModule.ts'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export function usePresenter<T extends BasicPresenter<A>, A>(
  presenterToken: TokenType<T>,
  args?: A
): T {
  const moduleClass = useCurrentModule()
  const isFirstInit = useRef(false)
  const indexForStrictMode = useRef(0)

  const presenter = useMemo(() => {
    try {
      // Пытаемся получить презентер из текущего модуля
      return  moduleManager.getService<T>(moduleClass, presenterToken)
    } catch (error) {
      console.warn(`Could not resolve presenter ${String(presenterToken)} from module ${moduleClass.name}, trying root container...`, error)
      try {
        return moduleManager.getServiceFromRoot<T>(presenterToken)
      } catch (rootError) {
        console.error(`Error resolving presenter ${String(presenterToken)} from root container:`, rootError)
        throw rootError
      }
    }
  }, [moduleClass, presenterToken])

  useLayoutEffect(() => {
    indexForStrictMode.current++
    const index = indexForStrictMode.current

    // В StrictMode вызывается дважды, в Production один раз
    if (index === (IS_PRODUCTION ? 1 : 2) || isFirstInit.current) {
      presenter.init(args)
      isFirstInit.current = true
    }

    return () => {
      if (index === (IS_PRODUCTION ? 1 : 2) || isFirstInit.current) {
        presenter.destroy()
        indexForStrictMode.current = 0
      }
    }
  }, [presenter, presenterToken, JSON.stringify(args), moduleClass])

  return presenter
}
