import { motion } from 'framer-motion'
import { ForwardedRef, forwardRef } from 'react'
import styled from 'styled-components'
import { AppSpaceView } from '../../../../../../common/app-ui/presentation/AppSpaceView.tsx'
import { AppTxHashView } from '../../../../../../common/app-ui/presentation/AppTxHashView.tsx'
import { SwapListItemModel } from '../../../model/SwapListItemModel.ts'

const Container = styled(motion.div)`
  border: 1px solid #747474;
  padding: 12px;
  border-radius: ${({theme}) => theme.size.borderRadius.small};
  font-size: small;
`

const DateContainer = styled.div`
  text-align: end;
`

export interface SwapListHolderProps {
  item: SwapListItemModel
}

export const SwapListHolderView = forwardRef(({item}: SwapListHolderProps, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <Container
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0, scaleY: 0}}
      layout
      transition={{
        exit: {duration: 0.1},
      }}
      ref={ref}
    >
      <div>State: {item.state}</div>
      <AppSpaceView />
      <div>{item.currencyFromSymbol} &#10230; {item.currencyToSymbol}</div>
      <div>{item.valueFrom}  &#10230; {item.valueTo}</div>
      <AppSpaceView />
      {item.txHash && <div>tx hash: <AppTxHashView hash={item.txHash} chain={item.chain} /></div>}
      {item.txFee && <div>tx fee: {item.txFee}</div>}
      <DateContainer>{item.updateAt}</DateContainer>
    </Container>
  )
})
