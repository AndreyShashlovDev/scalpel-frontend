import { ReactNode } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: ${({theme}) => theme.color.background};
  color: ${({theme}) => theme.color.text.primary};
`

export interface PageLayoutParams {
  children: ReactNode
  props?: unknown
}

export const PageLayoutView = ({children, ...props}: PageLayoutParams) => {

  return (
    <Container {...props}>
      {children}
    </Container>
  )
}
