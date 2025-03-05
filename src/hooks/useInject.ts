import { useMemo } from 'react'
import { Abstract, getDIValue, Newable } from '../utils/arch/Injections.ts'

export const useInject = <T>(qualifier: Newable<T> | Abstract<T>): T => useMemo(
  () => getDIValue(qualifier),
  [qualifier]
)
