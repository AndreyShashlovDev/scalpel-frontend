import styled from 'styled-components'

const InputWrapper = styled.input`
  width: 100%;
  font-size: ${({theme}) => theme.size.fontSize.medium};
`

export interface AppTextInputProps {
  value?: string | undefined
  onChange?: (value: string | undefined) => void
  min?: number
  max?: number
}

export const AppTextInputView = ({value, onChange, min, max, ...props}: AppTextInputProps) => {

  return <InputWrapper
    value={value}
    onChange={(e) => onChange && onChange(e.target.value)}
    minLength={min}
    maxLength={max}
    {...props}
  />
}
