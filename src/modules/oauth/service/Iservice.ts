interface IOauthService {
  initiateGoogleOAuth(state: string): Promise<string>;
  googleOAuthCallback(query: any): Promise<object>;
  initiateFacebookOAuth(state: string): Promise<string>;
  facebookOAuthCallback(query: any): Promise<object>;
}

export default IOauthService;