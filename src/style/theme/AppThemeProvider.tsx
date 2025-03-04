import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'
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

  const theme = useMemo(
    () =>
      currentThemeColor === 'light' ? new CommonLightTheme() : new CommonDarkTheme(),
    [currentThemeColor]
  )

  const changeThemeColor = useCallback((color: ThemeColorType) => {
    setCurrentThemeColor(color)
  }, [])

  const contextValue = useMemo(() => ({
    changeThemeColor,
    currentThemeColor,
    theme
  }), [changeThemeColor, currentThemeColor, theme])

  return (
    <AppThemeContext.Provider value={contextValue}>
      {children}
    </AppThemeContext.Provider>
  )
}
