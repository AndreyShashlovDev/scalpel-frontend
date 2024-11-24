import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useLayoutEffect, useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { useApp } from '../../../AppProvider.tsx'
import { AppMenuView } from '../../../common/app-ui/presentation/AppMenuView.tsx'
import { AppRouting } from '../../../common/router/AppRouting.tsx'
import useObservable from '../../../hooks/useObservable.ts'
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

const BasicContainer = styled(motion.div)`
  background-color: ${({theme}) => theme.color.background};
  color: ${({theme}) => theme.color.text.primary};
  font-weight: 700;
  font-size: ${({theme}) => theme.size.fontSize.small};
  height: 100%;
  overflow: hidden;
`

function App() {
  const presenter = useMemo(() => getDIValue(AppPresenter), [])
  const menuItems = useObservable(presenter.getMainMenuItems(), [])
  const selectedMenuItemId = useObservable(presenter.getSelectedMenuItemId(), undefined)
  const routing = useCallback(() => AppRouting, [])
  const {theme} = useAppTheme()
  const {seVisibilityAppMenu, visibilityAppMenu} = useApp()

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
          <AppMenuView
            selected={selectedMenuItemId}
            items={menuItems}
            isOpened={visibilityAppMenu}
            toggle={(v) => seVisibilityAppMenu(v)}
            key={'app-menu'}
            onMenuItemClick={(id) => presenter.onMenuItemClick(id)}
          />
        </AnimatePresence>
      </BasicContainer>
    </ThemeProvider>
  )
}

export default App
