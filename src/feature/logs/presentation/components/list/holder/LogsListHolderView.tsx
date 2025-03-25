import { domAnimation, LazyMotion, m } from 'framer-motion'
import { ForwardedRef, forwardRef } from 'react'
import styled from 'styled-components'
import { AppSpaceView } from '../../../../../../common/app-ui/AppSpaceView.tsx'
import { LogListItemModel } from '../../../model/LogListItemModel.ts'

const Container = styled(m.div)`
  border: 1px solid #747474;
  padding: 12px;
  border-radius: ${({theme}) => theme.size.borderRadius.small};
  max-width: 640px;
  width: 100%;
`

const DateContainer = styled.div`
  text-align: end;
`

const LineContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: start;
  gap: 4px;
  margin-bottom: 4px;
  text-wrap: nowrap;
`

const WrapTextContainer = styled.span`
  text-wrap: wrap;
  overflow-wrap: break-word;
  word-break: break-all;
`

export interface LogsListHolderProps {
  item: LogListItemModel
}

export const LogsListHolderView = forwardRef(({item}: LogsListHolderProps, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <LazyMotion features={domAnimation} strict>
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
            <LineContainer key={key}>{key}: <WrapTextContainer>{`${value}`}</WrapTextContainer></LineContainer>
          ))
        }
        <DateContainer>{item.createdAt}</DateContainer>
      </Container>
    </LazyMotion>
  )
})
