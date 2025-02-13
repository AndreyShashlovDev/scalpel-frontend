export abstract class AuthRepository {

  public abstract refreshToken(): Promise<string>
}
