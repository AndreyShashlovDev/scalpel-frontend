import { ForwardedRef, forwardRef, ReactElement, useState } from 'react'
import styled from 'styled-components'
import { AppButton } from '../AppButton.tsx'
import { PageHeaderView } from '../PageHeaderView.tsx'
import { BasicDialogView, DialogCallback } from './BasicDialogView.tsx'

type CallBackDataType = {
  title: string
  message: string | ReactElement
}

export interface DialogAlertCallBack extends DialogCallback<CallBackDataType> {}

export interface DialogAlertProps {
}

const DescContainer = styled.div`
  font-size: ${({theme}) => theme.size.fontSize.medium};
  text-align: center;
  margin-top: 12px;
  overflow: hidden;
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-top: 8px;
  padding: 16px 8px 8px;
  border-top: 1px solid white;
`

export const DialogAlertView = forwardRef((
  // eslint-disable-next-line no-empty-pattern
  {}: DialogAlertProps,
  ref: ForwardedRef<DialogAlertCallBack>
) => {
  const [data, setData] = useState<CallBackDataType>()

  return (
    <BasicDialogView
      title={<PageHeaderView text={data?.title ?? ''} hasMainMenu={false} />}
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
          <DescContainer>{data?.message}</DescContainer>
          <ButtonsContainer>
            <AppButton
              onClick={() => {
                // @ts-expect-error sadsd
                ref?.current?.closeDialog()
              }}
              text={'OK'}
            />
          </ButtonsContainer>
        </div>
      }
    />
  )
})
