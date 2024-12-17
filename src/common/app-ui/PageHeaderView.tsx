import styled from 'styled-components'
import { useApp } from '../../AppProvider.tsx'
import { AppBurgerButtonView } from './AppBurgerButtonView.tsx'
import { AppIconButton, AppIconButtonProps } from './AppIconButton.tsx'
import { AppTitleProps, AppTitleView } from './AppTitleView.tsx'
import { ComponentSize } from './ComponentSize.ts'

const Container = styled.div`
  display: flex;
  background: ${({theme}) => theme.color.background};
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
`

const TitleContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%)
`

export const PageHeaderContainer = styled(AppTitleView)`
  display: flex;
  padding: 0 14px;
  position: sticky;
  justify-content: end;
  align-items: center;
  height: ${({theme}) => theme.size.header};
  text-align: center;
  background: ${({theme}) => theme.color.background};
  font-size: large;
  border-bottom-color: grey;
  border-bottom-width: 1px;
  border-bottom-style: solid;
`

export interface PageHeaderProps extends AppTitleProps {
  hasMainMenu?: boolean,
  buttons?: AppIconButtonProps[]
}

export const PageHeaderView = ({text, hasMainMenu, buttons}: PageHeaderProps) => {
  const {visibilityAppMenu, seVisibilityAppMenu} = useApp()
  return (
    <Container>
      <PageHeaderContainer text={''}>
        <>
          <TitleContainer>{text}</TitleContainer>
          <ButtonsContainer>
            {buttons?.map((item, index) => (
              <AppIconButton
                key={index}
                icon={item.icon}
                onClick={() => item.onClick()}
                size={ComponentSize.SMALL}
              />
            ))}
            {
              (hasMainMenu ?? true)
                ? <AppBurgerButtonView isOpened={visibilityAppMenu} toggle={(v) => seVisibilityAppMenu(v)} />
                : <span />
            }
          </ButtonsContainer>
      </>
      </PageHeaderContainer>
      </Container>
  )
}
