import { motion } from 'framer-motion'
import { ForwardedRef, forwardRef } from 'react'
import styled from 'styled-components'
import { AppSpaceView } from '../../../../../../common/app-ui/presentation/AppSpaceView.tsx'
import { LogListItemModel } from '../../../model/LogListItemModel.ts'

const Container = styled(motion.div)`
  border: 1px solid #747474;
  padding: 12px;
  border-radius: ${({theme}) => theme.size.borderRadius.small};
`

const DateContainer = styled.div`
  text-align: end;
`

export interface LogsListHolderProps {
  item: LogListItemModel
}

export const LogsListHolderView = forwardRef(({item}: LogsListHolderProps, ref: ForwardedRef<HTMLDivElement>) => {
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
      <div>Id: {item.id}</div>
      <div>Type: {item.type}</div>

      <AppSpaceView />
      {
        Object.entries(item.log).map(([key, value]) => (
          <div key={key}>{key}: {`${value}`}</div>
        ))
      }
      <DateContainer>{item.createdAt}</DateContainer>
    </Container>
  )
})
