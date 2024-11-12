import DateTimeFormatOptions = Intl.DateTimeFormatOptions

export class DateUtils {
  public static readonly FORMAT_MMM_DD: DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
  }

  public static readonly FORMAT_MMMM_DD: DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
  }

  public static readonly FORMAT_MM: DateTimeFormatOptions = {
    month: 'short',
  }

  public static readonly FORMAT_YYYY_HH: DateTimeFormatOptions = {
    hour: '2-digit',
    year: 'numeric',
  }

  public static readonly DATE_FORMAT_SHORT: DateTimeFormatOptions = {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  }

  public static readonly DATE_FORMAT_SHORT2: DateTimeFormatOptions = {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    month: 'short',
  }

  public static readonly FORMAT_SHORT_DD_YYYY: DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }

  public static readonly FORMAT_MM_DD_YYYY: DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  }

  public static readonly FORMAT_HH_MM_SS: DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }

  public static readonly FORMAT_HH_MM: DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }

  public static readonly FORMAT_HH_MM_PMAM: DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }

  public static readonly FORMAT_YY_MM_DD_HH_mm: DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }

  public static toFormat(value: number | Date, format?: DateTimeFormatOptions): string {
    const date: Date = typeof value === 'number' ? new Date(value) : value

    return format
      ? format.day || format.month || format.year
        ? date.toLocaleDateString([navigator.language], format)
        : date.toLocaleString([navigator.language], format)
      : date.toString()
  }

  public static toFormatShort(value: number | Date): string {
    const date: Date = typeof value === 'number' ? new Date(value) : value
    const today = new Date()
    const formattedToday = DateUtils.toFormat(new Date(), DateUtils.FORMAT_MM_DD_YYYY)
    const dateFormatted = DateUtils.toFormat(date, DateUtils.FORMAT_MM_DD_YYYY)
    const isToday = dateFormatted === formattedToday
    const isThisYear = date.getFullYear() === today.getFullYear()

    if (isToday) {
      return date.toLocaleTimeString([navigator.language], {...DateUtils.FORMAT_HH_MM, hour12: true})
    } else if (isThisYear) {
      return date.toLocaleDateString([navigator.language], DateUtils.FORMAT_MMM_DD)
    } else {
      return date.toLocaleDateString([navigator.language], DateUtils.FORMAT_MM_DD_YYYY)
    }
  }

  public static toFormatFullDate(value: number | Date): string {
    const date: Date = typeof value === 'number' ? new Date(value) : value
    const year = date.getFullYear()
    const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    return `${year}-${month}-${day}`
  }

  public static daysDiff(date: Date): number {
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - date.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
}
