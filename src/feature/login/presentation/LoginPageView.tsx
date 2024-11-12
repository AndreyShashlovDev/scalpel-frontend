import { useLayoutEffect, useMemo } from 'react'
import styled from 'styled-components'
import { AppAddressView } from '../../../common/app-ui/presentation/AppAddressView.tsx'
import { AppButton } from '../../../common/app-ui/presentation/AppButton.tsx'
import { AppTitleView } from '../../../common/app-ui/presentation/AppTitleView.tsx'
import { ComponentSize } from '../../../common/app-ui/presentation/ComponentSize.ts'
import { LoadingView } from '../../../common/app-ui/presentation/LoadingView.tsx'
import { PageLayoutView } from '../../../common/app-ui/presentation/PageLayoutView.tsx'
import useObservable from '../../../hooks/useObservable.ts'
import { getDIValue } from '../../../Injections.ts'
import { LoginPagePresenter } from '../domain/LoginPagePresenter.ts'
import '../domain/LoginPresenterModule.ts'

const PageLayoutViewWrapper = styled(PageLayoutView)`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100vw;
  height: 100vh;
`

const LoginButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 300px;
  padding: 32px;
  gap: 16px;
  text-align: center;
  font-size: 24px;
`

export const LoginPageView = () => {
  const presenter = useMemo(() => getDIValue(LoginPagePresenter), [])
  const walletAddress = useObservable(presenter.walletAddress(), undefined)
  const isConnected = useObservable(presenter.IsWalletConnected(), false)
  const isLoading = useObservable(presenter.getIsLoading(), true)

  useLayoutEffect(() => {
    presenter.init()

    return () => presenter.destroy()
  }, [presenter])

  return (
    <PageLayoutViewWrapper>
      {
        isLoading
          ? <LoadingView />
          : (
            <>
              <AppTitleView text={'Scalpel'} size={ComponentSize.LARGEST} />

              <LoginButtonContainer>
                <span>Authorization</span>

                <AppButton
                  disabled={isConnected}
                  text={walletAddress ? <AppAddressView address={walletAddress} /> : 'Connect wallet'}
                  onClick={() => presenter.connectWalletClick()}
                />

                <AppButton
                  disabled={!isConnected}
                  text={'Login'}
                  onClick={() => presenter.signMessageClick()}
                />
              </LoginButtonContainer>
            </>
          )
      }
    </PageLayoutViewWrapper>
  )
}

export default LoginPageView
