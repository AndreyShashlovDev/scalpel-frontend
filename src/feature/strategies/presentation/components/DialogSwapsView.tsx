import { ForwardedRef, forwardRef, useState } from 'react'
import { BasicDialogView, DialogCallback } from '../../../../common/app-ui/presentation/dialog/BasicDialogView.tsx'
import { PageHeaderView } from '../../../../common/app-ui/presentation/PageHeaderView.tsx'
import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { SwapPageView } from '../../../swap/presentation/SwapPageView.tsx'

type CallBackDataType = { strategyHash: string, chain: ChainType }

export interface DialogSwapsCallBack extends DialogCallback<CallBackDataType> {}

export interface DialogSwapsProps {}

export const DialogSwapsView = forwardRef((
  _dialogSwapsProps: DialogSwapsProps,
  ref: ForwardedRef<DialogSwapsCallBack>
) => {
  const [data, setData] = useState<CallBackDataType>()

  return (
    <BasicDialogView
      title={<PageHeaderView text={`Swaps ${data?.chain}`} />}
      // @ts-expect-error is ok
      ref={ref}
      // @ts-expect-error is ok
      onOpen={(data: CallBackDataType) => {
        if (data) {
          setData(data)
        }
      }}
      content={<SwapPageView strategyHash={data?.strategyHash} chain={data?.chain} />}
    />
  )
})
