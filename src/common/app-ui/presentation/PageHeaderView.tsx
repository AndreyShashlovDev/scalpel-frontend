import styled from 'styled-components'
import { useApp } from '../../../AppProvider.tsx'
import { AppBurgerButtonView } from './AppBurgerButtonView.tsx'
import { AppTitleProps, AppTitleView } from './AppTitleView.tsx'

const Container = styled.div`
  display: flex;
  justify-content: center;
  background: ${({theme}) => theme.color.background};
`

export const PageHeaderContainer = styled(AppTitleView)`
  display: grid;
  padding: 0 14px;
  position: sticky;
  grid-template-columns: 32px 1fr 32px;
  height: ${({theme}) => theme.size.header};
  text-align: center;
  background: ${({theme}) => theme.color.background};
  font-size: large;
  border-bottom-color: grey;
  border-bottom-width: 1px;
  border-bottom-style: solid;
`

export interface PageHeaderProps extends AppTitleProps {
  hasMainMenu?: boolean
}

export const PageHeaderView = ({text, hasMainMenu}: PageHeaderProps) => {
  const {visibilityAppMenu, seVisibilityAppMenu} = useApp()
  return (
    <Container>
      <PageHeaderContainer text={''}>
        <>
        <span />
          {text}
          {
            (hasMainMenu ?? true)
              ? <AppBurgerButtonView isOpened={visibilityAppMenu} toggle={(v) => seVisibilityAppMenu(v)} />
              : <span />
          }
          </>
      </PageHeaderContainer>
    </Container>
  )
}
