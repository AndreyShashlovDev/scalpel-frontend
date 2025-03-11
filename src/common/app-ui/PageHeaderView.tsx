import styled from 'styled-components'
import { useApp } from '../../AppProvider.tsx'
import BackArrowIcon from '../../assets/icons/app/BackArrowIcon.svg'
import { AppBurgerButtonView } from './AppBurgerButtonView.tsx'
import { AppIconButton, AppIconButtonProps } from './AppIconButton.tsx'
import { AppTitleProps, AppTitleView } from './AppTitleView.tsx'
import { ComponentSize } from './ComponentSize.ts'

const Container = styled.div`
  display: flex;
  background: ${({theme}) => theme.color.background};
  width: 100%;
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  justify-self: start;
`

const TitleContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  pointer-events: none;
`

export const PageHeaderContainer = styled(AppTitleView)`
  display: flex;
  padding: 0 14px;
  position: sticky;
  justify-content: space-between;
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
  hasBackButton?: boolean
  onBackButtonClick?: () => void
}

export const PageHeaderView = ({text, hasBackButton, onBackButtonClick, hasMainMenu, buttons}: PageHeaderProps) => {
  const {visibilityAppMenu, seVisibilityAppMenu} = useApp()
  return (
    <Container>
      <PageHeaderContainer text={''}>
        <>
          <ButtonsContainer>
            {
              (hasBackButton ?? false)
                ? <AppIconButton
                  icon={<BackArrowIcon />}
                  size={ComponentSize.SMALL}
                  onClick={() => onBackButtonClick && onBackButtonClick()}
                />
                : <span />
            }
          </ButtonsContainer>

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
