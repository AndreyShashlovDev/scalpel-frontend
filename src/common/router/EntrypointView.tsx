import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { getDIValue } from '../../utils/arch/Injections.ts'
import { LoadingView } from '../app-ui/LoadingView.tsx'
import { ApplicationRouter } from './domain/ApplicationRouter.ts'

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

export const EntrypointView = () => {
  const nav = useNavigate()

  useEffect(
    () => {
      getDIValue(ApplicationRouter).setNavigate(nav)
    },
    [nav]
  )

  return <LoadingContainer><LoadingView /></LoadingContainer>
}
