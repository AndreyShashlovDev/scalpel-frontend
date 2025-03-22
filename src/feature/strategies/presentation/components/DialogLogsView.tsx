import { ForwardedRef, forwardRef, useState } from 'react'
import { BasicDialogView, DialogCallback } from '../../../../common/app-ui/dialog/BasicDialogView.tsx'
import { PageHeaderView } from '../../../../common/app-ui/PageHeaderView.tsx'
import { LogsPageView } from '../../../logs/presentation/LogsPageView.tsx'

type CallBackDataType = { strategyHash: string }

export interface DialogLogsCallBack extends DialogCallback<CallBackDataType> {}

export interface DialogLogsProps {}

export const DialogLogsView = forwardRef((
  _dialogSwapsProps: DialogLogsProps,
  ref: ForwardedRef<DialogLogsCallBack>
) => {
  const [data, setData] = useState<CallBackDataType>()

  return (
    <BasicDialogView
      isFullScreen={true}
      title={<PageHeaderView text={`Logs`} hasMainMenu={false} />}
      // @ts-expect-error is ok
      ref={ref}
      // @ts-expect-error is ok
      onOpen={(data: CallBackDataType) => {
        if (data) {
          setData(data)
        }
      }}
      content={
        <LogsPageView strategyHash={data?.strategyHash} />
      }
    />
  )
})
