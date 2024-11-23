import styled from 'styled-components'
import { SwapState } from '../../../../../common/repository/data/model/SwapResponse.ts'

export interface SwapStateProps {
  state: SwapState
}

const StateText = new Map<SwapState, string>([
  [SwapState.WAIT_FOR_ACTION, 'Wait user action'],
  [SwapState.WAIT_EXECUTION, 'Wait for execute'],
  [SwapState.EXECUTION, 'Execution in progress'],
  [SwapState.EXECUTION_SUCCESS, 'Tx executed success'],
  [SwapState.EXECUTION_FAILED, 'Tx failed'],
  [SwapState.FAILED, 'Failed'],
  [SwapState.CANCELLED, 'Canceled'],
])

const StateContainer = styled.span<{ $state?: SwapState }>`
  color: ${({$state, theme}) => {
    switch ($state) {
      case SwapState.EXECUTION:
      case SwapState.WAIT_EXECUTION:
      case SwapState.EXECUTION_SUCCESS:
        return theme.color.common.green

      case SwapState.EXECUTION_FAILED:
      case SwapState.FAILED:
      case SwapState.CANCELLED:
        return theme.color.common.red

      case SwapState.WAIT_FOR_ACTION:
        return theme.color.common.orange

      default:
        return theme.color.text.primary
    }
  }};
`

export const SwapStateView = ({state}: SwapStateProps) => {
  return (
    <StateContainer $state={state}>
      {StateText.get(state) ?? 'unknown'}
    </StateContainer>
  )
}
