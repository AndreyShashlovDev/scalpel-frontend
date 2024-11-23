import { motion } from 'framer-motion'
import { ForwardedRef, forwardRef } from 'react'
import styled from 'styled-components'
import { AppAddressView } from '../../../../../../common/app-ui/presentation/AppAddressView.tsx'
import { WalletListItemModel } from '../../../model/WalletListItemModel.ts'

const Container = styled(motion.div)`
  border: 1px solid #747474;
  padding: 12px;
  border-radius: ${({theme}) => theme.size.borderRadius.small};
  max-width: 640px;
  width: 100%;
`

export interface WalletListHolderProps {
  item: WalletListItemModel
}

export const WalletHolderView = forwardRef(({item}: WalletListHolderProps, ref: ForwardedRef<HTMLDivElement>) => {
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
      <div>Address:&nbsp;<AppAddressView address={item.address} /></div>
      <div>Name: {item.name}</div>
    </Container>
  )
})
