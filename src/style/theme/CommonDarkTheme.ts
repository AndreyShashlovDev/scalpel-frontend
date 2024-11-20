import { CommonLightTheme } from './CommonLightTheme.ts'

export class CommonDarkTheme extends CommonLightTheme {

  constructor() {
    super()

    this.color.background = '#080404FF'
    this.color.text.primary = '#d9d9d9'
    this.color.button.normal.text.primary = '#fafafa'
  }
}
