import { memo, ReactElement, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { AppButton } from './AppButton.tsx'
import { ComponentSize } from './ComponentSize.ts'

const ButtonWrapper = styled(AppButton)<{ $size: string }>`
  ${props => css`
    width: ${props.$size} !important;
    max-width: ${props.$size} !important;
    min-width: ${props.$size} !important;
    height: ${props.$size} !important;
    max-height: ${props.$size} !important;
    min-height: ${props.$size} !important;
    border: none !important;
    border-radius: 0 !important;
  `
  };
  padding: 0 !important;
`

export interface AppIconButtonProps {
  icon: ReactElement
  size?: ComponentSize
  onClick: () => void
  disabled?: boolean
}

export const AppIconButton = memo(({icon, size, onClick, disabled}: AppIconButtonProps) => {

  const getSize = useCallback(() => {
    if (size === ComponentSize.SMALL) {
      return '24px'

    } else if (size === ComponentSize.SMALLEST) {
      return '16px'

    } else if (size === ComponentSize.LARGE) {
      return '32px'
    }

    return '32px'
  }, [size])

  return <ButtonWrapper disabled={disabled} $size={getSize()} onClick={onClick} text={icon} />
})
