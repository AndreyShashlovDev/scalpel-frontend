import styled from 'styled-components'
import { AppAddressView } from '../../../common/app-ui/AppAddressView.tsx'
import { AppButton } from '../../../common/app-ui/AppButton.tsx'
import { AppTitleView } from '../../../common/app-ui/AppTitleView.tsx'
import { ComponentSize } from '../../../common/app-ui/ComponentSize.ts'
import { LoadingView } from '../../../common/app-ui/LoadingView.tsx'
import { PageLayoutView } from '../../../common/app-ui/PageLayoutView.tsx'
import useObservable from '../../../hooks/useObservable.ts'
import { usePresenter } from '../../../hooks/usePresenter.ts'
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

const AddressWrapper = styled(AppAddressView)`
  font-size: ${({theme}) => theme.size.fontSize.medium} !important;
`

export const LoginPageView = () => {
  const presenter = usePresenter(LoginPagePresenter)
  const walletAddress = useObservable(presenter.walletAddress(), undefined)
  const isConnected = useObservable(presenter.IsWalletConnected(), false)
  const isLoading = useObservable(presenter.getIsLoading(), true)

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

                <div>
                 {walletAddress && <AddressWrapper address={walletAddress} />}
                </div>
                <AppButton
                  text={walletAddress && isConnected ? 'Disconnect' : 'Connect wallet'}
                  onClick={() => isConnected ? presenter.disconnectWalletClick() : presenter.connectWalletClick()}
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
