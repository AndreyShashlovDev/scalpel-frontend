import { useCallback } from 'react'
import { ClockLoader } from 'react-spinners'
import styled, { useTheme } from 'styled-components'
import { ComponentSize, ComponentSizeProps } from './ComponentSize.ts'

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
`

export interface LoadingProps extends ComponentSizeProps {

}

export const LoadingView = ({size}: LoadingProps) => {
  const theme = useTheme()

  const sizeToPx = useCallback(() => {
    if (size === ComponentSize.SMALLEST) {
      return 16
    } else if (size === ComponentSize.SMALL) {
      return 24
    } else if (size === ComponentSize.LARGE) {
      return 48
    } else if (size === ComponentSize.LARGEST) {
      return 56
    }

    return 34
  }, [size])

  return (
    <LoaderWrapper>
      <ClockLoader color={theme.color.text.primary} size={sizeToPx()} />
    </LoaderWrapper>
  )
}
