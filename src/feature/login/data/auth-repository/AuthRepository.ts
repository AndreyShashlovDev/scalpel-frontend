export abstract class AuthRepository {

  public abstract getSignMessage(): Promise<string>

  public abstract login(address: string, message: string, sig: string): Promise<string>

  public abstract registration(address: string, msg: string, signature: string): Promise<string>
}
