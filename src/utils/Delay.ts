export const Delay = (ms: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), ms))
