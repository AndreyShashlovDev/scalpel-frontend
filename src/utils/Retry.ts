import { Delay } from './Delay'

export const Retry = async <T>(
  fnc: () => Promise<T>,
  repeat: number,
  delay: number = 5000,
  label?: string
): Promise<T> => {

  for (let i = 0; i <= repeat; i++) {
    try {
      return await fnc() as T
    } catch (e: unknown) {
      console.info(label ?? 'retry error:', e)
      if (i === repeat) {
        throw e
      }
      // ignore
    }

    console.log('try repeat call method. repeat count:', `${i + 1}/${repeat}`)
    await Delay(delay)
  }

  throw new Error('wrong repeat?')
}
