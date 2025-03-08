import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { AppButton } from './AppButton.tsx'
import { ComponentSize } from './ComponentSize.ts'
import { ComponentVariant } from './ComponentVariant.ts'

interface PrivateKeyProps {
  pk: string
  onPKShown: () => void
}

const Container = styled.div`
  width: 100%;
  background-color: ${({theme}) => theme.color.background};
`

const KeyContainer = styled.div`
  word-break: break-all;
  position: relative;
`

const TruncatedKey = styled.div`
  font-size: ${({theme}) => theme.size.fontSize.small};
`
const HOLD_DURATION = 3

export const PrivateKeyView = memo(({pk, onPKShown}: PrivateKeyProps) => {
  const [showKey, setShowKey] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [copied, setCopied] = useState(false)
  const holdTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (showKey) {
      onPKShown()
    }
  }, [showKey, onPKShown])

  const handleMouseDown = useCallback(() => {
    setIsHolding(true)
    setTimer(0)

    if (holdTimerRef.current) {
      window.clearInterval(holdTimerRef.current)
    }

    holdTimerRef.current = window.setInterval(() => {
      setTimer(prev => {
        if (prev >= HOLD_DURATION) {
          if (holdTimerRef.current) {
            clearInterval(holdTimerRef.current)
          }
          setShowKey(true)
          setIsHolding(false)
          return 0
        }
        return prev + 0.1
      })
    }, 100)
  }, [])

  const handleMouseUp = useCallback(() => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current)
    }
    setIsHolding(false)
    if (timer < HOLD_DURATION) {
      setTimer(0)
    }
  }, [timer])

  const handleMouseLeave = useCallback(() => {
    handleMouseUp()
  }, [handleMouseUp])

  const copyToClipboard = useCallback(() => {
    if (pk) {
      navigator.clipboard.writeText(pk)
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
        .catch(err => {
          console.error('Could not copy text: ', err)
        })
    }
  }, [pk])

  const buttonText = useMemo(() => {
    return isHolding
      ? `Hold to show (${Math.max(0, HOLD_DURATION - Math.floor(timer))}s)`
      : 'Show private key'
  }, [isHolding, timer])

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current)
      }
    }
  }, [])

  return (
    <Container>
      {!showKey ? (
        <AppButton
          variant={ComponentVariant.DANGER}
          size={ComponentSize.SMALL}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          text={buttonText}
        />
      ) : (
        <KeyContainer>
          <TruncatedKey>{pk}</TruncatedKey>
          <AppButton
            variant={ComponentVariant.DANGER}
            size={ComponentSize.SMALL}
            onClick={copyToClipboard}
            text={copied ? 'Copied!' : 'Copy'}
          />
        </KeyContainer>
      )}
    </Container>
  )
})
