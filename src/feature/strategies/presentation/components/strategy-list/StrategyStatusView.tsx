import styled from 'styled-components'
import { StrategyStatusType } from '../../../../../common/repository/data/model/StrategyResponse.ts'

export interface StrategyStatusProps {
  status: StrategyStatusType
}

const StrategyStatusText = new Map<StrategyStatusType, string>([
  [StrategyStatusType.CREATED, 'Created'],
  [StrategyStatusType.APPROVE_IN_PROGRESS, 'Tokens approve in progress'],
  [StrategyStatusType.IN_PROGRESS, 'In progress'],
  [StrategyStatusType.USER_ACTION_REQUIRED, 'User action required'],
  [StrategyStatusType.PAUSED, 'Paused'],
  [StrategyStatusType.CANCELED, 'Canceled'],
])

const StatusContainer = styled.span<{ $status?: StrategyStatusType }>`
  color: ${({$status, theme}) => {
    switch ($status) {
      case StrategyStatusType.IN_PROGRESS:
      case StrategyStatusType.APPROVE_IN_PROGRESS:
        return theme.color.common.green

      case StrategyStatusType.CANCELED:
      case StrategyStatusType.USER_ACTION_REQUIRED:
        return theme.color.common.red

      case StrategyStatusType.PAUSED:
      case StrategyStatusType.CREATED:
        return theme.color.common.orange

      default:
        return theme.color.text.primary
    }
  }};
`

export const StrategyStatusView = ({status}: StrategyStatusProps) => {
  return (
    <StatusContainer $status={status}>
      {StrategyStatusText.get(status) ?? 'unknown'}
    </StatusContainer>
  )
}
