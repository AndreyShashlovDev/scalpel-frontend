import { motion } from 'framer-motion'
import styled from 'styled-components'

const Container = styled.div`

`
const SelectWrapper = styled(motion.select)`
  padding: 1px 4px;
  font-size: 12px !important;
`

const OptionWrapperItem = styled.option`
  font-size: 10px !important;
  height: 8px !important;
  padding: 0 !important;
  margin: 0 !important;
`

export interface AppComboBoxProps {
  items: string[]
  onSelect: (item: string) => void
  defaultSelection: string
}

export const AppComboBoxView = ({items, onSelect, defaultSelection}: AppComboBoxProps) => {

  return (
    <Container>
      <SelectWrapper onChange={e => onSelect(e.target.value)}>
        <OptionWrapperItem
          value={defaultSelection}
        >{defaultSelection}</OptionWrapperItem>
        {items.map(item => (
          <OptionWrapperItem
            value={item}
            key={item}
          >{item}</OptionWrapperItem>)
        )}
      </SelectWrapper>
    </Container>
  )
}
