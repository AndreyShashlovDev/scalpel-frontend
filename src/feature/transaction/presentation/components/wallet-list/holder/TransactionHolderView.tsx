import { motion } from 'framer-motion'
import { ForwardedRef, forwardRef } from 'react'
import styled from 'styled-components'
import { AppAddressView } from '../../../../../../common/app-ui/AppAddressView.tsx'
import { AppTxHashView } from '../../../../../../common/app-ui/AppTxHashView.tsx'
import { ChainIconView } from '../../../../../../common/app-ui/ChainIconView.tsx'
import { ComponentSize } from '../../../../../../common/app-ui/ComponentSize.ts'
import { ChainName } from '../../../../../../utils/ChainsData.ts'
import { TxStatus } from '../../../../data/model/TransactionResponse.ts'
import { TransactionListItemModel } from '../../../model/TransactionListItemModel.ts'

const Container = styled(motion.div)`
  border: 1px solid #747474;
  padding: 12px;
  border-radius: ${({theme}) => theme.size.borderRadius.small};
  max-width: 640px;
  width: 100%;
`

const LineContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: start;
  gap: 4px;
  margin-bottom: 4px;
  text-wrap: nowrap;
`
const TextWrapContainer = styled.span`
  text-wrap: wrap;
  overflow-wrap: break-word;
  word-break: break-all;
`

const DateContainer = styled(LineContainer)`
  justify-content: end;
  width: 100%;
`

const Capitalize = styled.span`
  text-transform: capitalize;
`

const StatusColor = styled.div<{ $status: TxStatus | undefined }>`
  color: ${({$status, theme}) => {
    switch ($status) {
      case TxStatus.SUCCESS:
      case TxStatus.IN_PROGRESS:
        return theme.color.common.green

      case TxStatus.CANCELED:
        return theme.color.common.red

      case TxStatus.FAILED:
        return theme.color.common.red

      default:
        return theme.color.text.primary
    }
  }};
`

export interface WalletListHolderProps {
  item: TransactionListItemModel
}

export const TransactionHolderView = forwardRef(({item}: WalletListHolderProps, ref: ForwardedRef<HTMLDivElement>) => {
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
      <LineContainer>Status: <StatusColor $status={item.success}>{item.statusText}</StatusColor></LineContainer>
      {item.errorReason
        ? <LineContainer>Error: <TextWrapContainer>{item.errorReason}</TextWrapContainer></LineContainer>
        : undefined
      }
      <LineContainer>Chain: {ChainName.get(item.chain)}</LineContainer>
      <LineContainer>Wallet:&nbsp;<AppAddressView address={item.address} /></LineContainer>
      {item.nonce
        ? <LineContainer>Nonce: {item.nonce}</LineContainer>
        : undefined
      }
      <LineContainer>To:&nbsp;<AppAddressView address={item.recipientAddress} /></LineContainer>
      <LineContainer>Method: <Capitalize>{item.callData.method}</Capitalize></LineContainer>
      {item.executedAt
        ? <LineContainer>Executed at: {item.executedAt}</LineContainer>
        : undefined
      }
      {item.txHash
        ? <LineContainer>Hash: <AppTxHashView hash={item.txHash} chain={item.chain} /></LineContainer>
        : undefined
      }
      {item.txFee
        ? (
          <LineContainer>
            Fee:&nbsp;
            <ChainIconView
              chain={item.chain}
              size={ComponentSize.SMALLEST}
            />
            {item.txFee}
          </LineContainer>
        )
        : undefined
      }

      <DateContainer>{item.createdAt}</DateContainer>
    </Container>
  )
})
