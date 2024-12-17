import { useMemo } from 'react'
import { Abstract, getDIValue, Newable } from '../Injections.ts'

export const useInject = <T>(qualifier: Newable<T> | Abstract<T>): T => useMemo(
  () => getDIValue(qualifier),
  [qualifier]
)
