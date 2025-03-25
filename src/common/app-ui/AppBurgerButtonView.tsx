import { domAnimation, LazyMotion, m } from 'framer-motion'
import { useMemo } from 'react'
import styled from 'styled-components'

const ButtonContainer = styled(m.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  color: ${({theme}) => theme.color.text.primary};
  cursor: pointer;
`
const Wrapper = styled(m.div)`
  display: flex;
  justify-content: end;
`

// @ts-expect-error sadasdas
const Path = (props) => (
  <m.path
    fill='transparent'
    strokeWidth='3'
    stroke='currentColor'
    strokeLinecap='round'
    {...props}
  />
)

export interface AppBurgerMenuProps {
  isOpened: boolean
  toggle: (value: boolean) => void
}

export const AppBurgerButtonView = ({isOpened, toggle}: AppBurgerMenuProps) => {

  const buttonView = useMemo(() => {
    return (
      <ButtonContainer onClick={() => toggle(!isOpened)}>
    <svg width='23' height='23' viewBox='0 0 20 20'>
      <Path
        variants={{
          closed: {d: 'M 2 2.5 L 20 2.5'},
          open: {d: 'M 3 16.5 L 17 2.5'}
        }}
      />
      <Path
        d='M 2 9.423 L 20 9.423'
        variants={{
          closed: {opacity: 1},
          open: {opacity: 0}
        }}
        transition={{duration: 0.1}}
      />
      <Path
        variants={{
          closed: {d: 'M 2 16.346 L 20 16.346'},
          open: {d: 'M 3 2.5 L 17 16.346'}
        }}
      />
    </svg>
    </ButtonContainer>
    )
  }, [isOpened, toggle])

  return (
    <LazyMotion features={domAnimation} strict>
      <Wrapper
        initial={false}
        animate={isOpened ? 'open' : 'closed'}
        custom='100%'
      >
        {buttonView}
      </Wrapper>
    </LazyMotion>
  )
}
