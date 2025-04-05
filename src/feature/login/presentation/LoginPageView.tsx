import { useInject, useObservable, usePresenter } from 'flexdi/react'
import { useCallback, useLayoutEffect, useRef } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
import { AppAddressView } from '../../../common/app-ui/AppAddressView.tsx'
import { AppButton } from '../../../common/app-ui/AppButton.tsx'
import { AppSpaceView } from '../../../common/app-ui/AppSpaceView.tsx'
import { AppTitleView } from '../../../common/app-ui/AppTitleView.tsx'
import { ComponentSize } from '../../../common/app-ui/ComponentSize.ts'
import { DialogAlertCallBack, DialogAlertView } from '../../../common/app-ui/dialog/DialogAlertView.tsx'
import { LoadingView } from '../../../common/app-ui/LoadingView.tsx'
import { PageLayoutView } from '../../../common/app-ui/PageLayoutView.tsx'
import { LoginPagePresenter } from '../domain/LoginPagePresenter.ts'
import { LoginPageDialogProvider } from '../router/LoginPageDialogProvider.ts'

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
const AddressContainer = styled.div`
  height: 32px;
`

const AddressWrapper = styled(AppAddressView)`
  font-size: ${({theme}) => theme.size.fontSize.medium} !important;
`

export const LoginPageView = () => {
  const presenter = usePresenter(LoginPagePresenter)
  const dialogProvider = useInject(LoginPageDialogProvider)
  const walletAddress = useObservable(presenter.walletAddress(), undefined)
  const isConnected = useObservable(presenter.IsWalletConnected(), false)
  const isLoading = useObservable(presenter.getIsLoading(), true)
  const dialogAlertRef = useRef<DialogAlertCallBack | null>(null)

  useLayoutEffect(() => {
    dialogProvider.setDialogCallback({
      openJoinTgAccountDialog(title: string, message: string, link: string): void {
        dialogAlertRef.current?.openDialog({
          title,
          message: <Trans
            i18nKey={message}
            values={{url: link}}
            components={{a: <a />}}
          />
        })
      }
    })

    return () => {
      dialogProvider.destroy()
    }
  }, [dialogProvider])

  const handleConnectDisconnectClick = useCallback(() => {
    if (isConnected) {
      presenter.disconnectWalletClick()
    } else {
      presenter.connectWalletClick()
    }
  }, [presenter, isConnected])

  const handleLoginClick = useCallback(() => {
    presenter.signMessageClick()
  }, [presenter])

  const handleRegisterClick = useCallback(() => {
    presenter.onRegisterClick()
  }, [presenter])

  const handleDemoClick = useCallback(() => {
    presenter.onDemoClick()
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

                <AddressContainer>
                 {walletAddress && <AddressWrapper address={walletAddress} />}
                </AddressContainer>

                <AppButton
                  text={walletAddress && isConnected ? 'Disconnect' : 'Connect wallet'}
                  onClick={handleConnectDisconnectClick}
                />

                <AppButton
                  disabled={!isConnected}
                  text={'Login'}
                  onClick={handleLoginClick}
                />

                <AppButton
                  disabled={!isConnected}
                  text={'Registration'}
                  onClick={handleRegisterClick}
                />

                <AppSpaceView />
                <AppButton
                  text={'Demo'}
                  onClick={handleDemoClick}
                />
              </LoginButtonContainer>
            </>
          )
      }
      <DialogAlertView ref={dialogAlertRef} />
    </PageLayoutViewWrapper>
  )
}

export default LoginPageView
