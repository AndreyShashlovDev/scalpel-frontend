import { ForwardedRef, forwardRef } from 'react'
import styled from 'styled-components'
import { BasicDialogView, DialogCallback } from '../../../../common/app-ui/dialog/BasicDialogView.tsx'
import { PageHeaderView } from '../../../../common/app-ui/PageHeaderView.tsx'
import CreateStrategyPageView from '../../../create-strategy/presentation/CreateStrategyPageView.tsx'

const Container = styled.div`
  height: 100vh;
`

export interface DialogCreateStrategyProps {
  onCloseDialog: () => void
}

export const DialogCreateStrategyView = forwardRef((
  {onCloseDialog}: DialogCreateStrategyProps,
  ref: ForwardedRef<DialogCallback<void>>
) => {
  return (
    <BasicDialogView
      isFullScreen={true}
      title={<PageHeaderView text={`Create simulation`} hasMainMenu={false} />}
      // @ts-expect-error is ok
      ref={ref}
      onClose={() => onCloseDialog()}
      content={
        <Container>
          <CreateStrategyPageView />
        </Container>
      }
    />
  )
})
