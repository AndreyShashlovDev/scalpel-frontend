import { MessageSigner } from '../../../../common/service/message-signer/MessageSigner.ts'
import { Interactor } from '../../../../utils/arch/Interactor.ts'
import { AuthRepository } from '../../data/auth-repository/AuthRepository.ts'

export class RegistrationInteractor implements Interactor<void, Promise<string>> {

  constructor(
    private readonly messageSigner: MessageSigner,
    private readonly authRepository: AuthRepository,
  ) {
  }

  public async invoke(): Promise<string> {
    const msg = await this.authRepository.getSignMessage()
    const sig = await this.messageSigner.signMessage(msg)
    const joinCode = await this.authRepository.registration(sig.address, msg, sig.signature)

    return joinCode
  }
}
