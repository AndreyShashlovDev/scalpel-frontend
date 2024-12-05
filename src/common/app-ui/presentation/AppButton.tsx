import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import styled from 'styled-components'
import { ComponentSize, ComponentSizeProps } from './ComponentSize.ts'
import { ComponentVariant, ComponentVariantProps } from './ComponentVariant.ts'

const BasicButton = styled(motion.button)<{
  $disabled: boolean | undefined,
  size?: ComponentSize,
  $variant?: ComponentVariant
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: ${({size}) => {
    if (size === ComponentSize.SMALL) {
      return '12px'

    } else if (size === ComponentSize.SMALLEST) {
      return '10px'

    } else if (size === ComponentSize.LARGE) {
      return '16px'

    } else if (size === ComponentSize.LARGEST) {
      return '18px'
    }

    return '14px'
  }};

  width: 100%;
  max-width: 300px;
  min-width: 80px;

  background-color: ${({theme}) => theme.color.button.normal.background.primary!};
  border: 1px solid ${({theme, $variant}) => {
    if ($variant === ComponentVariant.DANGER) {
      return theme.color.button.normal.border.error
    }
    
    return theme.color.button.normal.border.primary!
  }};

  height: ${({size}) => {

    if (size === ComponentSize.SMALL) {
      return '24px'

    } else if (size === ComponentSize.SMALLEST) {
      return '18px'
    }

    return '34px'
  }};


  overflow: hidden;
  //padding: 0 8px;
  border-radius: ${({theme}) => theme.size.borderRadius.medium};

  cursor: ${({$disabled}) => {
    if ($disabled) {
      return 'auto'
    } else {
      return 'pointer'
    }
  }};

  color: ${({theme, $disabled, $variant}) => {
    if ($disabled) {
      return theme.color.button.disabled!.text.primary
    } else {
      if ($variant === ComponentVariant.DANGER) {
        return theme.color.button.normal.text.error
      }

      return theme.color.button.normal.text.primary
    }
  }};

  > span {
    color: ${({theme, $disabled, $variant}) => {
      if ($disabled) {
        return theme.color.button.disabled!.text.primary
      } else {

        if ($variant === ComponentVariant.DANGER) {
          console.log('variant', $variant, theme.color.button.normal.text.error)
          return theme.color.button.normal.text.error
        }

        return theme.color.button.normal.text.primary
      }
    }};
  }
`

export interface AppButtonProps extends ComponentSizeProps, ComponentVariantProps {
  text?: ReactNode
  onClick: () => void
  disabled?: boolean
}

export const AppButton = ({text, onClick, disabled, size, variant, ...props}: AppButtonProps) => {

  return (
    <BasicButton
      $variant={variant ?? ComponentVariant.STANDARD}
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
