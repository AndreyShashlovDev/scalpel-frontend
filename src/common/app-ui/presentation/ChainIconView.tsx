import styled from 'styled-components'
import { ChainType } from '../../repository/data/model/ChainType.ts'
import { ComponentSize, ComponentSizeProps } from './ComponentSize.ts'

const ImgContainer = styled.div<ComponentSizeProps>`

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

const Container = styled.span`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 8px;
  text-transform: capitalize;
`

export interface ChainIconProps extends ComponentSizeProps {
  chain: ChainType
  showChainName?: boolean
}

const mapChainName: Map<ChainType, string> = new Map([
  [ChainType.POLYGON, 'polygon'],
  [ChainType.ETHEREUM_MAIN_NET, 'ethereum'],
])

const url = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/<chain>/info/logo.png'

export const ChainIconView = ({chain, size, showChainName}: ChainIconProps) => {
  return (
    <Container>
      <ImgContainer size={size}>
        <img src={url.replace('<chain>', mapChainName.get(chain) ?? '')} alt={chain} />
      </ImgContainer>
      {showChainName ? mapChainName.get(chain) : undefined}
    </Container>
  )
}
