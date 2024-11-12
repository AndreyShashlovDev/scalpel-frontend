import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import styled from 'styled-components'
import { ComponentSize, ComponentSizeProps } from './ComponentSize.ts'

const BasicButton = styled(motion.button)<{ $disabled: boolean | undefined, size: ComponentSize }>`
  font-size: 16px;
  width: 100%;
  max-width: 320px;
  
  height: ${({size}) => {
    if (size === ComponentSize.SMALL) {
      return '24px'
    }

    return '34px'
  }};

  
  overflow: hidden;
  padding: 0 8px;
  border-radius: ${({theme}) => theme.size.borderRadius.small};

  cursor: ${({$disabled}) => {
    if ($disabled) {
      return 'auto'
    } else {
      return 'pointer'
    }
  }};

  color: ${({theme, $disabled}) => {
    if ($disabled) {
      return theme.color.button.disabled!.text.primary
    } else {
      return theme.color.button.normal.text.primary
    }
  }};

  //background: ${({theme}) => theme.color.button.normal.background.primary};
`

export interface AppButtonProps extends ComponentSizeProps {
  text?: ReactNode
  onClick: () => void
  disabled?: boolean
}

export const AppButton = ({text, onClick, disabled, size, ...props}: AppButtonProps) => {
  return (
    <BasicButton
      size={size ?? ComponentSize.STANDARD}
      whileTap={disabled ? {} : {scale: 0.95}}
      // type='button'
      // value={text}
      disabled={disabled}
      onClick={() => !disabled && onClick()}
      $disabled={disabled}
      {...props}
    >
      {text}
    </BasicButton>
  )
}
