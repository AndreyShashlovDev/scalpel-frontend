import { motion } from 'framer-motion'
import { MutableRefObject, ReactNode, useEffect, useRef } from 'react'
import PullToRefresh from 'react-simple-pull-to-refresh'
import styled from 'styled-components'
import { useApp } from '../../../AppProvider.tsx'

const Container = styled(motion.div)`
  background-color: ${({theme}) => theme.color.background};
  color: ${({theme}) => theme.color.text.primary};
`

const PullRefreshWrapper = styled(PullToRefresh)`
  background: ${({theme}) => theme.color.background};

  .ptr__loader {
    background: ${({theme}) => theme.color.background};
  }

  .lds-ellipsis div {
    background: ${({theme}) => theme.color.text.primary};
  }
`

export interface PageLayoutParams {
  children: ReactNode
  props?: unknown
  refresh?: () => void
  fetched?: boolean
}

export const PageLayoutView = ({children, refresh, fetched, ...props}: PageLayoutParams) => {
  const {visibilityAppMenu} = useApp()

  const refreshFunction = useRef<(() => Promise<unknown>) | null>(null) as MutableRefObject<unknown | null>
  const resolveRefresh = useRef<(() => void) | null>(null) as MutableRefObject<(() => void) | null>

  useEffect(() => {
    if (fetched && resolveRefresh.current) {
      resolveRefresh.current()
      resolveRefresh.current = null
      refreshFunction.current = null
    }
  }, [fetched])

  return (
    <PullRefreshWrapper
      pullDownThreshold={130}
      maxPullDownDistance={130}
      isPullable={refresh !== undefined}
      onRefresh={async () => {
        if (refresh) {
          refreshFunction.current = new Promise<void>(resolve => {
            resolveRefresh.current = resolve
          })

          refresh()
          await refreshFunction.current
        }
      }}

    >
    <Container
      animate={{scale: visibilityAppMenu ? 0.95 : 1}}
      {...props}
    >
      {children}
    </Container>
  </PullRefreshWrapper>
  )
}
