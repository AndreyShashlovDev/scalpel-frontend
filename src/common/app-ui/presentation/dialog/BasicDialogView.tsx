import { AnimatePresence, motion } from 'framer-motion'
import { ForwardedRef, forwardRef, ReactNode, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { AppTitleView } from '../AppTitleView.tsx'

const BackgroundLayer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100vw;
  height: 100vh;
  background-color: ${({theme}) => theme.color.overlay};
  overflow: hidden;
`

const TitleContainer = styled.div<{ $canClose: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns:  1fr ${({$canClose}) => $canClose ? '56px' : '0'};
  padding-left: ${({$canClose}) => $canClose ? '56px' : '0'};
`

const CloseButton = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const DialogWindowContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const DialogWindowContent = styled.div`
  width: 80%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.color.background};

  border: 1px solid ${({theme}) => theme.color.button.normal.border.primary};
`

const ContentContainer = styled.div`
  padding: 8px;
`

export interface DialogCallback<T> {
  openDialog: (data?: T) => void
  closeDialog: () => void
}

export interface BasicDialogProps {
  title?: ReactNode
  content: ReactNode
  onOpen?: (data?: unknown) => void
  onClose?: (data?: unknown) => void
  canClose?: boolean
  isFullScreen?: boolean
}

export const BasicDialogView = forwardRef((
  {title, content, onOpen, onClose, canClose, isFullScreen}: BasicDialogProps,
  ref: ForwardedRef<DialogCallback<unknown>>
) => {
  const [isOpen, setIsOpen] = useState(false)
  const dataRef = useRef<unknown>()

  const openDialog = useCallback((data?: unknown) => {
    dataRef.current = data

    const element = document.getElementById('root')
    element?.classList.add('no-scroll')
    // window.scrollTo(0, 0)

    setIsOpen(true)
    if (onOpen) {
      onOpen(dataRef.current)
    }

  }, [onOpen])

  const closeDialog = useCallback(() => {
    setIsOpen(false)

    const modalRoot = document.getElementById('root')

    if ((modalRoot?.childNodes.length ?? 0) <= 1) {
      const element = document.getElementById('root')
      element?.classList.remove('no-scroll')
    }

    if (onClose) {
      onClose(dataRef.current)
    }
  }, [onClose])

  useImperativeHandle(ref, () => ({
    openDialog,
    closeDialog,
  }), [openDialog, closeDialog])

  const getTitleView = useMemo(() => {
    return (
      <TitleContainer $canClose={canClose ?? true}>
        {title && typeof title === 'string' ? <AppTitleView text={title} /> : title}
        {(canClose ?? true) && (
          <CloseButton
            whileTap={{scale: 0.95}}
            onClick={() => closeDialog()}
          >
            X
          </CloseButton>
        )
        }
      </TitleContainer>
    )
  }, [title, canClose, closeDialog])

  return (
    createPortal(
      <AnimatePresence>
        {isOpen && (
          <BackgroundLayer>
            {
              isFullScreen
                ? (
                  <>
                  {getTitleView}
                    <div>
                    {content}
                  </div>
                  </>
                )
                : (
                  <DialogWindowContainer>
                    <DialogWindowContent>
                      {getTitleView}
                      <ContentContainer>
                        {content}
                      </ContentContainer>
                    </DialogWindowContent>
                  </DialogWindowContainer>
                )
            }

          </BackgroundLayer>
        )}

      </AnimatePresence>
      ,
      // @ts-expect-error exist
      document.getElementById('modal-root')
    )
  )
})
