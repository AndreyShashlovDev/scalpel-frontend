import { motion } from 'framer-motion'
import React from 'react'
import styled from 'styled-components'

const SwitchContainer = styled.div<{ $isOn: boolean }>`
  width: 40px;
  height: 16px;
  background-color: ${(props) => (props.$isOn ? props.theme.color.common.green : '#ccc')};
  border-radius: 50px;
  display: flex;
  align-items: center;
  padding: 0px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s ease;
`

const Handle = styled(motion.div)`
  width: 18px;
  height: 18px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
`

export interface AppSwitchProps {
  isOn: boolean
  onToggle: (isOn: boolean) => void
}

const AppSwitchView: React.FC<AppSwitchProps> = ({isOn, onToggle}: AppSwitchProps) => {

  return (
    <SwitchContainer
      $isOn={isOn}
      onClick={() => {onToggle(!isOn)}}
    >
      <Handle
        layout
        initial={{x: 0}}
        animate={{x: isOn ? 22 : 0}}
        transition={{type: 'spring', stiffness: 400, damping: 20}}
      />
    </SwitchContainer>
  )
}

export default AppSwitchView
