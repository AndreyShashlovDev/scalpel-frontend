type SortOrderDirection = 'asc' | 'desc'

export class SortOrder<T> extends Array<{ key: keyof T, order: SortOrderDirection }> {

  constructor(arr?: Array<{ key: keyof T, order: SortOrderDirection }>) {
    super(0)

    if (Array.isArray(arr)) {
      this.push(...arr)
    }
  }

  public get(key: keyof T): { key: keyof T, order: SortOrderDirection } | undefined {
    return this.find(item => item.key === key)
  }

  public isNotEmpty = () => this.length > 0

  public toObject<T>(): T {
    const obj = {}
    this.forEach(item => {
        // @ts-expect-error it's ok
        obj[item.key] = item.order
      }
    )
    return obj as T
  }

  public toQuery() {
    return `${this!.map(item => `${item.key as string}:${item.order}`)}`
  }
}
