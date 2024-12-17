import styled from 'styled-components'
import { getTxHashUrl } from '../../utils/ScanUrl.ts'
import { TxHashShortener } from '../../utils/Shortener.ts'
import { ChainType } from '../repository/data/model/ChainType.ts'

const TxHashContainer = styled.span`
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  color: ${({theme}) => theme.color.link};
  cursor: pointer;
`

export const AppTxHashView = ({hash, chain}: { hash: string, chain: ChainType }) => {
  return <TxHashContainer
    onClick={() => {
      window.open(getTxHashUrl(hash, chain), '_blank', 'noopener noreferrer')
    }}
  >
    {hash && TxHashShortener(hash)}
  </TxHashContainer>
}
