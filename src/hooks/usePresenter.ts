import { useLayoutEffect, useMemo, useRef } from 'react'
import { IS_PRODUCTION } from '../CoreModule.ts'
import { BasicPresenter } from '../utils/arch/BasicPresenter.ts'
import { Abstract, getDIValue, Newable } from '../utils/arch/Injections.ts'

export const usePresenter = <T extends BasicPresenter<A>, A>(
  qualifier: Newable<T> | Abstract<T>,
  args?: A
): T => {
  const isFirstInit = useRef(false)
  const indexForStrictMode = useRef(0)

  const presenter = useMemo(() => getDIValue(qualifier), [qualifier])

  useLayoutEffect(() => {
    indexForStrictMode.current++
    const index = indexForStrictMode.current

    if (index === (IS_PRODUCTION ? 1 : 2) || isFirstInit.current) {
      presenter.init(args)
      isFirstInit.current = true
    }

    return () => {
      if (index === (IS_PRODUCTION ? 1 : 2) || isFirstInit.current) {
        presenter.destroy()
        indexForStrictMode.current = 0
        // destroyDiInstance(qualifier)
      }
    }
  }, [presenter, JSON.stringify(args)])

  return presenter
}
