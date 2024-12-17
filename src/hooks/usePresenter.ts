import { useLayoutEffect, useMemo } from 'react'
import { Abstract, getDIValue, Newable } from '../Injections.ts'
import { BasicPresenter } from '../utils/arch/BasicPresenter.ts'

export const usePresenter = <T extends BasicPresenter>(
  qualifier: Newable<T> | Abstract<T>
): T => {
  const presenter = useMemo(() => getDIValue(qualifier), [qualifier])

  useLayoutEffect(() => {
    presenter.init()

    return () => {
      presenter.destroy()
    }
  }, [presenter])

  return presenter
}
