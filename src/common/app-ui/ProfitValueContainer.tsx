import styled from 'styled-components'

export const ProfitValueContainer = styled.div<{ $value: number }>`
  display: flex;
  gap: 4px;
  color: ${({$value, theme}) => {
    if ($value > 0) {
      return theme.color.common.green
    } else if ($value < 0) {
      return theme.color.common.red
    }
    return 'unset'
  }};
`
