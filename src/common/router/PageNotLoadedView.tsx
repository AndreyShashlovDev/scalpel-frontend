import styled from 'styled-components'
import { AppButton } from '../app-ui/presentation/AppButton.tsx'
import { ComponentSize } from '../app-ui/presentation/ComponentSize.ts'

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  white-space: pre-line;
`

export const PageNotLoadedView = () => {

  return <Container>
    <h2>Приложение обновилось!</h2>
    <AppButton
      size={ComponentSize.STANDARD}
      onClick={() => window.location.reload()}
    >
      Перезагрузить
    </AppButton>
  </Container>
}
