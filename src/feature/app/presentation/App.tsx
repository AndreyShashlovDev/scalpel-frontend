import { AnimatePresence } from 'framer-motion'
import { useCallback, useLayoutEffect, useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { AppRouting } from '../../../common/router/AppRouting.tsx'
import { getDIValue } from '../../../Injections.ts'
import { useAppTheme } from '../../../style/theme/AppThemeProvider.tsx'
import '../domain/AppPresenterModule.ts'
import { AppPresenter } from '../domain/AppPresenter.ts'

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({theme}) => theme.color.background};
    color: ${({theme}) => theme.color.text.primary};
  }
`

const BasicContainer = styled.div(({theme}) => `
  background-color: ${theme.color.background};
  color: ${theme.color.text.primary};
  font-weight: 700;
  font-size: ${theme.size.fontSize.small}
`)

function App() {
  const presenter = useMemo(() => getDIValue(AppPresenter), [])
  const routing = useCallback(() => AppRouting, [])
  const {theme} = useAppTheme()

  useLayoutEffect(() => {
    presenter.init()

    return () => presenter.destroy()
  })

  return (
    <ThemeProvider theme={theme}>
       <GlobalStyle />
      <BasicContainer>
        <AnimatePresence>
          <RouterProvider router={routing()} />
        </AnimatePresence>
      </BasicContainer>
    </ThemeProvider>
  )
}

export default App
