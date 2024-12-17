import styled from 'styled-components'
import { AddressShortener } from '../../utils/Shortener.ts'

const AddressContainer = styled.span`
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  color: ${({theme}) => theme.color.link};
  text-wrap: wrap;
  overflow-wrap: break-word;
  word-break: break-all;
`

export const AppAddressView = ({address, ...props}: { address: string }) => {
  return <AddressContainer
    onClick={() => {
      navigator.clipboard.writeText(address)
        .then(() => alert('Copied address: ' + address))
        .catch(e => console.error(e))
    }}
    {...props}
  >
    {address && AddressShortener(address)}
  </AddressContainer>
}
