import styled from 'styled-components'
import { AppTitleView } from '../app-ui/AppTitleView.tsx'
import { ComponentSize } from '../app-ui/ComponentSize.ts'
import { LoadingView } from '../app-ui/LoadingView.tsx'
import { PageLayoutView } from '../app-ui/PageLayoutView.tsx'

const Container = styled(PageLayoutView)`
  display: flex;
  overflow: hidden;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export const EntrypointView = () => {
  return (
    <div>
      <Container>
        <AppTitleView text={'Scalpel'} size={ComponentSize.LARGEST} />
        <LoadingView size={ComponentSize.STANDARD} />
      </Container>
    </div>
  )
}
