import { ForwardedRef, forwardRef, useState } from 'react'
import styled from 'styled-components'
import { AppButton } from '../AppButton.tsx'
import { PageHeaderView } from '../PageHeaderView.tsx'
import { BasicDialogView, DialogCallback } from './BasicDialogView.tsx'

type CallBackDataType = {
  title: string
  message: string
  data: unknown
  dialogId: number | string
}

export interface DialogQuestionCallBack extends DialogCallback<CallBackDataType> {}

export interface DialogQuestionProps {
  onOkClick: (data: unknown, dialogId: number | string) => void
}

const DescContainer = styled.div`
  font-size: ${({theme}) => theme.size.fontSize.medium};
  text-align: center;
  margin-top: 12px;
  white-space: pre-wrap;
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

export const DialogQuestionView = forwardRef((
  {onOkClick}: DialogQuestionProps,
  ref: ForwardedRef<DialogQuestionCallBack>
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
                onOkClick(data?.data, data?.dialogId ?? -1)
                // @ts-expect-error sadsd
                ref?.current?.closeDialog()
              }}
              text={'OK'}
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
