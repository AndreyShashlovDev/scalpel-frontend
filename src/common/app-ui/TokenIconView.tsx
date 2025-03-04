import { memo } from 'react'
import styled from 'styled-components'
import { ChainType } from '../repository/data/model/ChainType.ts'
import { ComponentSize, ComponentSizeProps } from './ComponentSize.ts'

const Container = styled.div<ComponentSizeProps>`
  border-radius: 50%;

  width: ${({size}) => {
    if (size === ComponentSize.STANDARD) {
      return '32px'
    } else if (size === ComponentSize.SMALL) {
      return '24px'
    } else if (size === ComponentSize.SMALLEST) {
      return '16px'
    } else if (size === ComponentSize.LARGE) {
      return '48px'
    } else if (size === ComponentSize.LARGEST) {
      return '56px'
    }
    return '32px'
  }};

  min-width: ${({size}) => {
    if (size === ComponentSize.STANDARD) {
      return '32px'
    } else if (size === ComponentSize.SMALL) {
      return '24px'
    } else if (size === ComponentSize.SMALLEST) {
      return '16px'
    } else if (size === ComponentSize.LARGE) {
      return '48px'
    } else if (size === ComponentSize.LARGEST) {
      return '56px'
    }
    return '32px'
  }};


  height: ${({size}) => {
    if (size === ComponentSize.STANDARD) {
      return '32px'
    } else if (size === ComponentSize.SMALL) {
      return '24px'
    } else if (size === ComponentSize.SMALLEST) {
      return '16px'
    } else if (size === ComponentSize.LARGE) {
      return '48px'
    } else if (size === ComponentSize.LARGEST) {
      return '56px'
    }
    return '32px'
  }};

  min-height: ${({size}) => {
    if (size === ComponentSize.STANDARD) {
      return '32px'
    } else if (size === ComponentSize.SMALL) {
      return '24px'
    } else if (size === ComponentSize.SMALLEST) {
      return '16px'
    } else if (size === ComponentSize.LARGE) {
      return '48px'
    } else if (size === ComponentSize.LARGEST) {
      return '56px'
    }
    return '32px'
  }};


  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
    object-fit: scale-down;
  }
`

export interface TokenIconProps extends ComponentSizeProps {
  chain: ChainType
  address: string
  symbol: string
}

const mapChainName: Map<ChainType, string> = new Map([
  [ChainType.POLYGON, 'polygon'],
  [ChainType.ETHEREUM_MAIN_NET, 'ethereum'],
])

const url = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/<chain>/assets/<address>/logo.png'
const nativeCurrencyUrl = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/<chain>/info/logo.png'
export const TokenIconView = memo(({chain, address, symbol, size}: TokenIconProps) => {
  return (
    <Container size={size}>
      <img
        src={
          address.toLowerCase() === '0xffffffffffffffffffffffffffffffffffffffff'
            ? nativeCurrencyUrl.replace('<chain>', mapChainName.get(chain) ?? '')
            : url.replace('<chain>', mapChainName.get(chain) ?? '').replace('<address>', address)
        } alt={symbol}
      />
    </Container>
  )
})
