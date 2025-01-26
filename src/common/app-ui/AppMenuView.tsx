import { motion } from 'framer-motion'
import styled from 'styled-components'

const Sidebar = styled(motion.div)`
  display: flex;
  justify-content: end;
  position: fixed;
  top: ${({theme}) => theme.size.header};
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: rgba(0, 0, 0, 0.33);
  pointer-events: none;
`

const MenuContainer = styled(motion.div)`
  position: fixed;
  top: ${({theme}) => theme.size.header};
  width: 250px;
  height: 100%;
  display: flex;
  padding: 24px;
  align-items: end;
  background: ${({theme}) => theme.color.background};
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.42);
  color: #fff;
`
const ItemMenuContainer = styled(motion.div)<{ $selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({theme, $selected}) => $selected ? theme.color.text.secondary : theme.color.text.primary};
  font-size: ${({theme}) => theme.size.fontSize.larger};
  font-size: ${({theme, $selected}) => $selected ? theme.size.fontSize.medium : theme.size.fontSize.larger};
  height: 32px;
  width: 100%;
  margin-bottom: 12px;
  cursor: ${({$selected}) => $selected ? 'none' : 'pointer'};
`

const EmptyItemMenuContainer = styled.div`
  height: 32px;
  width: 100%;
`

export interface MenuItem {
  text?: string
  id: string | number
  selectable?: boolean
}

export interface AppMenuProps {
  items: MenuItem[]
  isOpened: boolean
  selected?: string | number
  toggle: (value: boolean) => void
  onMenuItemClick: (id: string | number) => void
}

export const AppMenuView = ({selected, items, isOpened, toggle, onMenuItemClick}: AppMenuProps) => {

  return (
    <Sidebar
      onClick={(e) => {
        toggle(false)
        e.stopPropagation()
      }}
      animate={{opacity: isOpened ? 1 : 0, pointerEvents: isOpened ? 'auto' : 'none'}}
    >
        <MenuContainer
          onClick={(e) => {e.stopPropagation()}}
          initial={{right: '-250px'}}
          animate={{right: isOpened ? '0' : '-250px', pointerEvents: isOpened ? 'auto' : 'none'}}
          transition={{type: 'spring', stiffness: 300, damping: 30}}
        >
          {
            items.map((item => {
                if (item.text) {
                  return (
                    <ItemMenuContainer
                      $selected={item.id === selected && (item.selectable ?? true)}
                      onClick={() => {
                        if (item.id === selected || !(item.selectable ?? true)) {
                          return
                        }
                        toggle(false)
                        onMenuItemClick(item.id)
                      }}
                      whileTap={item.id === selected ? undefined : {scale: 0.98}}
                      key={item.id}
                    >
                      {item.text}
                    </ItemMenuContainer>
                  )
                } else {
                  return (<EmptyItemMenuContainer key={Math.random()}/>)
                }
              }
            ))
          }
        </MenuContainer>
      </Sidebar>
  )
}
