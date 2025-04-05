import { createContext, useContext } from 'react'
import { DefaultTheme } from 'styled-components'
import { CommonDarkTheme } from './CommonDarkTheme.ts'

export type ThemeColorType = 'light' | 'dark'

export interface AppContextInterface {
  changeThemeColor: (color: ThemeColorType) => void
  currentThemeColor: ThemeColorType
  theme: DefaultTheme
}

export const AppThemeContext = createContext<AppContextInterface>({
  changeThemeColor: () => {},
  currentThemeColor: 'dark',
  theme: new CommonDarkTheme()
})

export function useAppTheme() {
  return useContext(AppThemeContext)
}
