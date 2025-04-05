import { useObservable, usePresenter } from 'flexdi/react'
import { AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { SnackbarPresenter } from '../domain/SnackbarPresenter.ts'
import { SnackbarItemView } from './components/SnackbarItemView.tsx'

const SnackbarViewContainer = styled.div`
  position: fixed;
  right: 24px;
  top: 24px;

  > div {
    margin-bottom: 8px;
  }

  > div:first-child {
    margin-top: 0;
  }

  > div:last-child {
    margin-bottom: 0;
  }
`

export const SnackbarView = () => {

  const presenter = usePresenter(SnackbarPresenter)
  const bars = useObservable(presenter.getBarItems(), [])

  return createPortal(
    <AnimatePresence>
      <SnackbarViewContainer>
        {
          bars.map(item => <SnackbarItemView
            id={item.id}
            key={item.id}
            text={item.text}
            closeButton={item.closeButton}
            timeoutClose={item.timeoutClose}
            onAutoClose={() => presenter.onCloseItem(item.id, /* auto */ true)}
            onCloseClick={() => presenter.onCloseItem(item.id, false)}
          />)
        }
      </SnackbarViewContainer>
     </AnimatePresence>
    ,
    // @ts-expect-error exist
    document.getElementById('snackbar-root')
  )
}
