import { ForwardedRef, forwardRef, useState } from 'react'
import { BasicDialogView, DialogCallback } from '../../../../common/app-ui/dialog/BasicDialogView.tsx'
import { PageHeaderView } from '../../../../common/app-ui/PageHeaderView.tsx'
import { ModuleLoader } from '../../../../utils/di-core/react/provider/ModuleLoader.tsx'
import { SwapPageModule } from '../../../swap/di/SwapPageModule.ts'
import { SwapPageView } from '../../../swap/presentation/SwapPageView.tsx'

type CallBackDataType = { strategyHash: string }

export interface DialogSwapsCallBack extends DialogCallback<CallBackDataType> {}

export interface DialogSwapsProps {}

export const DialogSwapsView = forwardRef((
  _dialogSwapsProps: DialogSwapsProps,
  ref: ForwardedRef<DialogSwapsCallBack>
) => {
  const [data, setData] = useState<CallBackDataType>()

  return (
    <BasicDialogView
      isFullScreen={true}
      title={<PageHeaderView text={`Swaps`} hasMainMenu={false} />}
      // @ts-expect-error is ok
      ref={ref}
      // @ts-expect-error is ok
      onOpen={(data: CallBackDataType) => {
        if (data) {
          setData(data)
        }
      }}
      content={
        <ModuleLoader
          module={SwapPageModule}
          children={<SwapPageView strategyHash={data?.strategyHash} />}
        />
      }
    />
  )
})
