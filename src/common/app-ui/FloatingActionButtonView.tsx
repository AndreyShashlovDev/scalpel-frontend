import { motion } from 'framer-motion'
import { MutableRefObject, ReactNode, useEffect, useState } from 'react'
import styled from 'styled-components'

const ButtonContainer = styled(motion.div)`
  padding: 8px;
  position: fixed;
  bottom: 64px;
  right: 12px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 888;
  cursor: pointer;
`

const buttonVariants = (visibleTop: number, hiddenTop: number) => {
  return {
    visible: {
      bottom: visibleTop,
      transition: {
        type: 'spring',
        opacity: 1,
        stiffness: 120,
        damping: 12,
      }
    },
    hidden: {
      bottom: hiddenTop,
      transition: {
        type: 'spring',
        opacity: 0,
        stiffness: 120,
        damping: 12,
      }
    }
  }
}

export interface FloatButtonProps {
  icon: ReactNode
  onClick: () => void
  scrollView: MutableRefObject<HTMLDivElement | null>
}

export const FloatingActionButtonView = ({icon, onClick, scrollView}: FloatButtonProps) => {

  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const view = scrollView.current

    const handleScroll = () => {
      const currentScrollY = view?.scrollTop ?? 0

      setIsVisible(currentScrollY < lastScrollY)
      setLastScrollY(currentScrollY)
    }

    view?.addEventListener('scroll', handleScroll)

    return () => {
      view?.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY, scrollView])

  return (
    <ButtonContainer
      whileTap={{scale: 0.95}}
      onClick={() => onClick()}
      variants={buttonVariants(64, -64)}
      initial={'hidden'}
      animate={isVisible ? 'visible' : 'hidden'}
    >
      {icon}
    </ButtonContainer>
  )
}
