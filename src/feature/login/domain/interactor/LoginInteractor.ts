import { AppAuthService } from '../../../../common/service/auth/AppAuthService.ts'
import { MessageSigner } from '../../../../common/service/message-signer/MessageSigner.ts'
import { Interactor } from '../../../../utils/arch/Interactor.ts'
import { AuthRepository } from '../../data/auth-repository/AuthRepository.ts'

export class LoginInteractor implements Interactor<void, Promise<void>> {

  constructor(
    private readonly messageSigner: MessageSigner,
    private readonly authRepository: AuthRepository,
    private readonly authService: AppAuthService,
  ) {
  }

  public async invoke(): Promise<void> {
    const msg = await this.authRepository.getSignMessage()
    const sig = await this.messageSigner.signMessage(msg)
    const token = await this.authRepository.login(sig.address, msg, sig.signature)

    await this.authService.saveData(token)
  }
}
