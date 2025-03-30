import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion'
import { useCallback } from 'react'
import { RouterProvider } from 'react-router-dom'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { useApp } from '../../../AppProvider.tsx'
import { AppMenuView } from '../../../common/app-ui/AppMenuView.tsx'
import { SnackbarView } from '../../../common/app-ui/snackbar/presentation/SnackbarView.tsx'
import { AppRouting } from '../../../common/router/AppRouting.tsx'
import { RouterInitializer } from '../../../common/router/RouterInitializer.tsx'
import { useAppTheme } from '../../../style/theme/AppThemeProvider.tsx'
import useObservable from '../../../utils/di-core/react/hook/useObservable.ts'
import { usePresenter } from '../../../utils/di-core/react/hook/usePresenter.ts'
import { AppPresenter } from '../domain/AppPresenter.ts'

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({theme}) => theme.color.background};
    color: ${({theme}) => theme.color.text.primary};
  }
`

const BasicContainer = styled(m.div)`
  background-color: ${({theme}) => theme.color.background};
  color: ${({theme}) => theme.color.text.primary};
  font-weight: 700;
  font-size: ${({theme}) => theme.size.fontSize.small};
  height: 100%;
  overflow: hidden;
`

export const App = () => {
  const presenter = usePresenter(AppPresenter)
  const menuItems = useObservable(presenter.getMainMenuItems(), [])
  const selectedMenuItemId = useObservable(presenter.getSelectedMenuItemId(), undefined)
  const routing = AppRouting
  const {theme} = useAppTheme()
  const {seVisibilityAppMenu, visibilityAppMenu} = useApp()

  const handleMenuItemClick = useCallback((id: string | number) => {
    presenter.onMenuItemClick(id)
  }, [presenter])

  const handleToggleMenu = useCallback((v: boolean) => {
    seVisibilityAppMenu(v)
  }, [seVisibilityAppMenu])

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <LazyMotion features={domAnimation} strict>
        <BasicContainer>
          <RouterProvider router={routing} />
          <RouterInitializer router={routing} />
          <AnimatePresence>
            <AppMenuView
              selected={selectedMenuItemId}
              items={menuItems}
              isOpened={visibilityAppMenu}
              toggle={handleToggleMenu}
              key={'app-menu'}
              onMenuItemClick={handleMenuItemClick}
            />
          </AnimatePresence>
        </BasicContainer>
      </LazyMotion>
      <SnackbarView />
    </ThemeProvider>
  )
}
