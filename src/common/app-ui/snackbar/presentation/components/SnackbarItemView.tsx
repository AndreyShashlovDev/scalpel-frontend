import { motion } from 'framer-motion'
import styled from 'styled-components'
import CloseIcon from '../../../../../assets/icons/app/DeleteIcon.svg'
import { AppIconButton } from '../../../AppIconButton.tsx'
import { ComponentSize } from '../../../ComponentSize.ts'

const SnackbarItemContainer = styled(motion.div)`
  display: flex;
  gap: 8px;
  background: black;
  color: white;
  border: 1px solid white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  justify-content: space-between;
  align-items: center;
  width: 250px;
  max-width: 250px;
`

const SnackbarItemMessageContainer = styled.div`
  color: white;
`

const SnackbarItemCloseContainer = styled.div`
`

export interface SnackbarItemProps {
  id: string | number
  text: string
  onCloseClick: () => void
  onAutoClose: () => void
  closeButton?: boolean
  timeoutClose?: number
}

export const SnackbarItemView = ({
  text,
  onCloseClick,
  closeButton,
}: SnackbarItemProps) => {

  return (
    <SnackbarItemContainer
      layout
      initial={{x: 300, opacity: 0}}
      animate={{x: 0, opacity: 1}}
      exit={{opacity: 0}}
      transition={{type: 'tween', duration: 0.5}}
    >
      <SnackbarItemMessageContainer>{text}</SnackbarItemMessageContainer>
      <SnackbarItemCloseContainer>
       {closeButton && <AppIconButton size={ComponentSize.SMALLEST} icon={<CloseIcon />} onClick={() => onCloseClick()} />}
      </SnackbarItemCloseContainer>
    </SnackbarItemContainer>
  )
}
