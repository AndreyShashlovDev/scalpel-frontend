import { ReactElement } from 'react'
import styled from 'styled-components'
import { ComponentSize, ComponentSizeProps } from './ComponentSize.ts'

const TitleContainer = styled.div<ComponentSizeProps>`
  background: ${({theme}) => theme.color.background};
  color: ${({theme}) => theme.color.title};
  font-size: ${({size}) => {
    if (size === ComponentSize.LARGEST) {
      return '58px'

    } else if (size === ComponentSize.LARGE) {
      return 'large'

    } else if (size === ComponentSize.STANDARD) {
      return 'medium'
    }

    return 'small'
  }};
  text-shadow: rgb(255, 153, 0) 0 0 2px, rgba(249, 164, 0, 0.6) 0 0 10px, rgba(249, 164, 0, 0.4) 0 5px 5px;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 24px;
`

export interface AppTitleProps extends ComponentSizeProps {
  text: string
  children?: ReactElement
}

export const AppTitleView = ({text, size, children, ...props}: AppTitleProps) => {
  return (
    <TitleContainer size={size} {...props}>
      {text}
      {children}
    </TitleContainer>
  )
}
