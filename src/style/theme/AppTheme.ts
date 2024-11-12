import 'styled-components'

export interface UIColor {
  primary: string
  secondary?: string
  accent?: string
  warning?: string
  error?: string
  success?: string
}

export interface UIControlColor {
  background: UIColor
  text: UIColor
  border: UIColor
}

export interface UIControlStateColor {
  normal: UIControlColor
  disabled?: UIControlColor
  checked?: UIControlColor
  hover?: UIControlColor
  focus?: UIControlColor
  active?: UIControlColor
}

export interface UILayerTextColor {
  title?: UIColor
  subTitle: UIColor
  body: UIColor
  desc: UIColor
}

export interface DefaultSize {
  smaller: string
  small: string
  medium: string
  large: string
}

export interface ExtendedSize extends DefaultSize {
  xx_small: string
  x_small: string
  larger: string
  x_large: string
  xx_large: string
}
