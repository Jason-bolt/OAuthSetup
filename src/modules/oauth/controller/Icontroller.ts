import { Request, Response } from "express";

interface IAdminController {
  initiateGoogleOAuth(req: Request, res: Response): Promise<object>;
  googleOAuthCallback(req: Request, res: Response): Promise<object>;
  initiateFacebookOAuth(req: Request, res: Response): Promise<object>;
  facebookOAuthCallback(req: Request, res: Response): Promise<object>;
  initiateGithubOAuth(req: Request, res: Response): Promise<object>;
  githubOAuthCallback(req: Request, res: Response): Promise<object>;
}

export default IAdminController;
