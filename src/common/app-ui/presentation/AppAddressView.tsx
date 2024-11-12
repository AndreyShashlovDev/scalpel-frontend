import styled from 'styled-components'
import { AddressShortener } from '../../../utils/Shortener.ts'

const AddressContainer = styled.span`
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  color: ${({theme}) => theme.color.link};
`

export const AppAddressView = ({address}: { address: string }) => {
  return <AddressContainer>{address && AddressShortener(address)}</AddressContainer>
}
