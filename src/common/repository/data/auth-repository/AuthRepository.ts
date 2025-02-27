export abstract class AuthRepository {

  public abstract refreshToken(): Promise<string>

  public abstract logout(): Promise<void>
}
