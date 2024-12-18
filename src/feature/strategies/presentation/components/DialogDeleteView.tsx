import { ForwardedRef, forwardRef, useState } from 'react'
import styled from 'styled-components'
import { AppButton } from '../../../../common/app-ui/AppButton.tsx'
import { ComponentSize } from '../../../../common/app-ui/ComponentSize.ts'
import { BasicDialogView, DialogCallback } from '../../../../common/app-ui/dialog/BasicDialogView.tsx'
import { PageHeaderView } from '../../../../common/app-ui/PageHeaderView.tsx'

type CallBackDataType = { strategyHash: string }

export interface DialogDeleteCallBack extends DialogCallback<CallBackDataType> {}

export interface DialogDeleteProps {
  onClickDelete: (strategyHash: string) => void
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
  gap: 32px;
  margin-top: 8px;
  padding: 16px 8px 8px;
  border-top: 1px solid white;
`

export const DialogDeleteView = forwardRef((
  {onClickDelete}: DialogDeleteProps,
  ref: ForwardedRef<DialogDeleteCallBack>
) => {
  const [data, setData] = useState<CallBackDataType>()

  return (
    <BasicDialogView
      title={<PageHeaderView text={`Archive order?`} hasMainMenu={false} />}
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
          <DescContainer>Are you sure you want to archive the order?</DescContainer>
          <ButtonsContainer>
            <AppButton
              size={ComponentSize.SMALL}
              onClick={() => {
                onClickDelete(data?.strategyHash ?? '')
                // @ts-expect-error sadsd
                ref?.current?.closeDialog()
              }}
              text={'OK'}
            />
            <AppButton
              size={ComponentSize.SMALL}
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
