import { IUser } from "../../../config/models/User";

interface IAuthService {
  initiateGoogleOAuth(state: string): Promise<string>;
  googleOAuthCallback(query: { code: string; state: string }): Promise<object>;
  initiateFacebookOAuth(state: string): Promise<string>;
  facebookOAuthCallback(query: {
    code: string;
    state: string;
  }): Promise<object>;
  initiateGithubOAuth(state: string): Promise<string>;
  githubOAuthCallback(query: { code: string; state: string }): Promise<object>;
  registerUser({
    email,
    first_name,
    last_name,
    username,
    password,
  }: {
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    password: string;
  }): Promise<IUser>;
  login({ email }: { email: string }): Promise<string>;
  resetPassword({
    newPassword,
    user,
  }: {
    newPassword: string;
    user: IUser;
  }): Promise<string>;
}

export default IAuthService;
