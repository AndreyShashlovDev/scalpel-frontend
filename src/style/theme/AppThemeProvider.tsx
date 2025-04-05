import { ReactNode, useCallback, useMemo, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { AppThemeContext, ThemeColorType } from './AppThemeContext.ts'
import { CommonDarkTheme } from './CommonDarkTheme.ts'
import { CommonLightTheme } from './CommonLightTheme.ts'

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
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </AppThemeContext.Provider>
  )
}
