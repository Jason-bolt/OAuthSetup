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
}

export default IAuthService;
