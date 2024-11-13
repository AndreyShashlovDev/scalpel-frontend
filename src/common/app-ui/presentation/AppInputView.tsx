import { InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { ComponentSize, ComponentSizeProps } from './ComponentSize.ts'

const Container = styled.span<{ size?: ComponentSize, $prefix?: string }>`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 0 1fr;
  
  &:before {
    content: ${({$prefix}) => `'${$prefix ?? ''}'`};
    position: relative;
    top: 2px;
    left: 4px;
  }
`

const InputWrapper = styled.input<{ size?: ComponentSize, $prefix?: string }>`

  width: 100%;

  padding-left: ${({$prefix}) => $prefix ? '16px' : '4px'};
  padding-top: 2px;

  height: ${({size}) => {
    if (size === ComponentSize.SMALL) {
      return '22px'
    }

    return '32px'
  }};


`

export interface AppInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, ComponentSizeProps {
  prefix?: string
  postfix?: string
}

export const AppInputView = ({prefix, size, ...props}: AppInputProps) => {

  return (
    <Container $prefix={prefix}>
      <InputWrapper size={size} $prefix={prefix} {...props} />
    </Container>
  )
}
