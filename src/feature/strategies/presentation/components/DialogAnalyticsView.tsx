import { ForwardedRef, forwardRef, useState } from 'react'
import { BasicDialogView, DialogCallback } from '../../../../common/app-ui/presentation/dialog/BasicDialogView.tsx'
import { PageHeaderView } from '../../../../common/app-ui/presentation/PageHeaderView.tsx'
import { AnalyticsPageView } from '../../analytics/presentation/AnalyticsPageView.tsx'

type CallBackDataType = { strategyHash: string }

export interface DialogAnalyticsCallBack extends DialogCallback<CallBackDataType> {}

export interface DialogAnalyticsProps {}

export const DialogAnalyticsView = forwardRef((
  _dialogSwapsProps: DialogAnalyticsProps,
  ref: ForwardedRef<DialogAnalyticsCallBack>
) => {
  const [data, setData] = useState<CallBackDataType>()

  return (
    <BasicDialogView
      isFullScreen={true}
      title={<PageHeaderView text={`Analytics`} hasMainMenu={false} />}
      // @ts-expect-error is ok
      ref={ref}
      // @ts-expect-error is ok
      onOpen={(data: CallBackDataType) => {
        if (data) {
          setData(data)
        }
      }}
      content={<AnalyticsPageView strategyHash={data?.strategyHash} />}
    />
  )
})
