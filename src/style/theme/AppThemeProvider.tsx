import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { DefaultTheme } from 'styled-components'
import { CommonDarkTheme } from './CommonDarkTheme.ts'
import { CommonLightTheme } from './CommonLightTheme.ts'

export type ThemeColorType = 'light' | 'dark'

export interface AppContextInterface {
  changeThemeColor: (color: ThemeColorType) => void
  currentThemeColor: ThemeColorType
  theme: DefaultTheme
}

const AppThemeContext = createContext<AppContextInterface>({
  changeThemeColor: () => {},
  currentThemeColor: 'dark',
  theme: new CommonDarkTheme()
})

export function useAppTheme() {
  return useContext(AppThemeContext)
}

export const AppThemeProvider = ({children}: { children: ReactNode }) => {

  const [currentThemeColor, setCurrentThemeColor] = useState<ThemeColorType>('dark')
  const [theme, setTheme] = useState<CommonLightTheme>(new CommonLightTheme())

  const changeThemeColor = (color: ThemeColorType) => {
    setCurrentThemeColor(color)
  }

  useEffect(() => {
    setTheme(currentThemeColor === 'light' ? new CommonLightTheme() : new CommonDarkTheme())
  }, [currentThemeColor])

  return (
    <AppThemeContext.Provider
      value={{
        changeThemeColor,
        currentThemeColor,
        theme
      }}
    >
      {children}
    </AppThemeContext.Provider>
  )
}
