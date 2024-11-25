import { ForwardedRef, forwardRef, useState } from 'react'
import styled from 'styled-components'
import { AppButton } from '../../../../common/app-ui/presentation/AppButton.tsx'
import { BasicDialogView, DialogCallback } from '../../../../common/app-ui/presentation/dialog/BasicDialogView.tsx'
import { PageHeaderView } from '../../../../common/app-ui/presentation/PageHeaderView.tsx'

type CallBackDataType = { strategyHash: string }

export interface DialogForceExecuteCallBack extends DialogCallback<CallBackDataType> {}

export interface DialogForceExecuteProps {
  onExecuteClick: (strategyHash: string) => void
}

const DescContainer = styled.div`
  font-size: ${({theme}) => theme.size.fontSize.medium};
  text-align: center;
  margin-top: 12px;
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  gap: 32px;
`

export const DialogForceExecuteView = forwardRef((
  {onExecuteClick}: DialogForceExecuteProps,
  ref: ForwardedRef<DialogForceExecuteCallBack>
) => {
  const [data, setData] = useState<CallBackDataType>()

  return (
    <BasicDialogView
      title={<PageHeaderView text={`Execute?`} hasMainMenu={false} />}
      // @ts-expect-error is ok
      ref={ref}
      // @ts-expect-error is ok
      onOpen={(data: CallBackDataType) => {
        if (data) {
          setData(data)
        }
      }}
      content={
        <div>
          <DescContainer>Are you sure you want to force execute the order now?</DescContainer>
          <ButtonsContainer>
            <AppButton
              onClick={() => {
                onExecuteClick(data?.strategyHash ?? '')
                // @ts-expect-error sadsd
                ref?.current?.closeDialog()
              }}
              text={'Execute now!'}
            />
            <AppButton
              onClick={() => {
                // @ts-expect-error sadsd
                ref?.current?.closeDialog()
              }} text={'Cancel'}
            />
          </ButtonsContainer>
        </div>
      }
    />
  )
})
