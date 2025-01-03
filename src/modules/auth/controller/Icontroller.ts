import { Request, Response } from "express";

interface IAuthController {
  initiateGoogleOAuth(req: Request, res: Response): Promise<object>;
  googleOAuthCallback(req: Request, res: Response): Promise<object>;
  initiateFacebookOAuth(req: Request, res: Response): Promise<object>;
  facebookOAuthCallback(req: Request, res: Response): Promise<object>;
  initiateGithubOAuth(req: Request, res: Response): Promise<object>;
  githubOAuthCallback(req: Request, res: Response): Promise<object>;
  registerUser(req: Request, res: Response): Promise<object>;
  login(req: Request, res: Response): Promise<object>;
  resetPassword(req: Request, res: Response): Promise<object>;
}

export default IAuthController;
