export type JsonObject<T> = {
  -readonly [P in keyof T]: T[P];
}

export type Address = `0x${string}`
export type TransactionHash = `0x${string}`
export type HexNumber = `0x${string}`

export class Pair<K = unknown, V = unknown> {

  constructor(public readonly key: K, public readonly value: V) {}

  // Пример метода для работы с парой
  toArray(): [K, V] {
    return [this.key, this.value]
  }

  // Другие методы можно добавить при необходимости
}
