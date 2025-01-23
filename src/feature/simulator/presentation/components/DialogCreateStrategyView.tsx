import { ForwardedRef, forwardRef } from 'react'
import styled from 'styled-components'
import { BasicDialogView, DialogCallback } from '../../../../common/app-ui/dialog/BasicDialogView.tsx'
import { PageHeaderView } from '../../../../common/app-ui/PageHeaderView.tsx'
import { CreateSimulationInjection } from '../../../create-strategy/domain/CreateSimulationInjection.ts'
import CreateStrategyPageView from '../../../create-strategy/presentation/CreateStrategyPageView.tsx'

const Container = styled.div`
  height: 100vh;
`

export const DialogCreateStrategyView = forwardRef((
  _,
  ref: ForwardedRef<DialogCallback<void>>
) => {

  return (
    <BasicDialogView
      isFullScreen={true}
      title={<PageHeaderView text={`Create simulation`} hasMainMenu={false} />}
      // @ts-expect-error is ok
      ref={ref}
      // @ts-expect-error is ok
      onOpen={(_: CallBackDataType) => {

      }}
      content={
        <Container>
          <CreateStrategyPageView invokeInject={CreateSimulationInjection} hasHeader={false} />
        </Container>
      }
    />
  )
})
