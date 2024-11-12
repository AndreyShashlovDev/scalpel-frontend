import { AnimatePresence } from 'framer-motion'
import { useCallback } from 'react'
import { RouterProvider } from 'react-router-dom'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { AppRouting } from '../../../common/router/AppRouting.tsx'
import { useAppTheme } from '../../../style/theme/AppThemeProvider.tsx'

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
  const routing = useCallback(() => AppRouting, [])
  const {theme} = useAppTheme()

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
