import styled from 'styled-components'
import { AppTitleView } from '../../../common/app-ui/AppTitleView.tsx'
import { ComponentSize } from '../../../common/app-ui/ComponentSize.ts'
import '../domain/SplashPagePresenterModule.ts'
import { LoadingView } from '../../../common/app-ui/LoadingView.tsx'
import { PageLayoutView } from '../../../common/app-ui/PageLayoutView.tsx'
import { usePresenter } from '../../../hooks/usePresenter.ts'
import { SplashPagePresenter } from '../domain/SplashPagePresenter.ts'

const Container = styled(PageLayoutView)`
  display: flex;
  overflow: hidden;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export const SplashPageView = () => {
  usePresenter(SplashPagePresenter)

  return (
    <div>
      <Container>
        <AppTitleView text={'Scalpel'} size={ComponentSize.LARGEST} />
        <LoadingView size={ComponentSize.STANDARD} />
      </Container>
    </div>
  )
}

export default SplashPageView
