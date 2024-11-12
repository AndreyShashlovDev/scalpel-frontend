import styled from 'styled-components'
import { AppButton, AppButtonProps } from './AppButton.tsx'

const BasicButton = styled(AppButton)`
  padding: 0;
  height: 30px;
  width: 30px;
`

export const AppIconButton = ({text, onClick, disabled, size}: AppButtonProps) => {
  return (
    <BasicButton
      size={size}
      onClick={onClick}
      disabled={disabled}
      text={text}
    />
  )
}
