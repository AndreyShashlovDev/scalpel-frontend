export class Pageable<E> {

  public readonly data: E[]
  public readonly total: number
  public readonly page: number

  constructor(data: E[], total: number, page: number) {
    this.data = data
    this.total = total
    this.page = page
  }

  public transform<E>(data: E[]): Pageable<E> {
    return new Pageable<E>(
      data,
      this.total,
      this.page
    )
  }
}
