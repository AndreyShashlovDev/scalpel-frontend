import 'styled-components'
import { DefaultSize, ExtendedSize, UIColor, UIControlStateColor } from './AppTheme.ts'

declare module 'styled-components' {

  export interface DefaultTheme {

    color: {
      overlay: string
      background: string
      title: string
      link: string
      text: UIColor
      button: UIControlStateColor
    }

    size: {
      header: string
      fontSize: ExtendedSize
      borderRadius: DefaultSize
      button: DefaultSize
      icon: ExtendedSize

      dimens: ExtendedSize
    }
  }
}
