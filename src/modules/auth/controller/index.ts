/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import IauthController from "./Icontroller";
import IAuthService from "../service/Iservice";
import logger from "../../../config/logger";
import authService from "../service";
import ResponseHandler from "../../../utils/helpers/response.handler";
import { StatusCodes } from "http-status-codes";

class AuthController implements IauthController {
  constructor(
    private authService: IAuthService,
    private _logger: typeof logger,
  ) {}

  initiateGithubOAuth = async (
    req: Request,
    res: Response,
  ): Promise<object> => {
    try {
      this._logger.info(
        "---------- AUTH CONTROLLER ----------: Initiating Github OAuth",
      );
      const response = new ResponseHandler(req, res);

      const state = req.query?.state as string;
      if (!state) {
        return response.fail({
          code: StatusCodes.NOT_FOUND,
          message: "State is required",
          data: null,
        });
      }
      const githubInitiationLink =
        await this.authService.initiateGithubOAuth(state);
      return response.success({
        message: "Github OAuth link generated successfully",
        data: githubInitiationLink,
      });
    } catch (error: any) {
      this._logger.info("An error occured in AuthController", error?.message);
      throw error;
    }
  };
  githubOAuthCallback = async (
    req: Request,
    res: Response,
  ): Promise<object> => {
    try {
      this._logger.info(
        "---------- AUTH CONTROLLER ----------: Completing Github OAuth",
      );
      const response = new ResponseHandler(req, res);
      const query = req.query as unknown as { code: string; state: string };
      const githubTokenData: any =
        await this.authService.githubOAuthCallback(query);

      if (githubTokenData?.error) {
        return response.fail({
          message: githubTokenData?.error,
          data: null,
          code: StatusCodes.NOT_FOUND,
        });
      }
      return response.success({
        message: "Signed in with Github successfully",
        data: githubTokenData,
      });
    } catch (error: any) {
      this._logger.info("An error occured in AuthController", error?.message);
      throw error;
    }
  };

  initiateGoogleOAuth = async (
    req: Request,
    res: Response,
  ): Promise<object> => {
    try {
      this._logger.info(
        "---------- AUTH CONTROLLER ----------: Initiating Google OAuth",
      );
      const response = new ResponseHandler(req, res);

      const state = req.query?.state as string;
      if (!state) {
        return response.fail({
          code: StatusCodes.NOT_FOUND,
          message: "State is required",
          data: null,
        });
      }
      const googleInitiationLink =
        await this.authService.initiateGoogleOAuth(state);
      return response.success({
        message: "Google OAuth link generated successfully",
        data: googleInitiationLink,
      });
    } catch (error: any) {
      this._logger.info("An error occured in AuthController", error?.message);
      throw error;
    }
  };

  googleOAuthCallback = async (
    req: Request,
    res: Response,
  ): Promise<object> => {
    try {
      this._logger.info(
        "---------- AUTH CONTROLLER ----------: Completing Google OAuth",
      );
      const response = new ResponseHandler(req, res);
      const query = req.query as unknown as { code: string; state: string };
      const googleTokenData = await this.authService.googleOAuthCallback(query);
      return response.success({
        message: "Signed in with Google successfully",
        data: googleTokenData,
      });
    } catch (error: any) {
      this._logger.info("An error occured in AuthController", error?.message);
      throw error;
    }
  };

  initiateFacebookOAuth = async (
    req: Request,
    res: Response,
  ): Promise<object> => {
    try {
      this._logger.info(
        "---------- AUTH CONTROLLER ----------: Initiating Facebook OAuth",
      );
      const response = new ResponseHandler(req, res);
      const state = req.query.state as string;
      const facebookInitiationLink =
        await this.authService.initiateFacebookOAuth(state);
      return response.success({
        message: "Facebook OAuth link generated successfully",
        data: facebookInitiationLink,
      });
    } catch (error: any) {
      this._logger.info("An error occured in AuthController", error?.message);
      throw error;
    }
  };

  facebookOAuthCallback = async (
    req: Request,
    res: Response,
  ): Promise<object> => {
    try {
      this._logger.info(
        "---------- AUTH CONTROLLER ----------: Completing Facebook OAuth",
      );
      const response = new ResponseHandler(req, res);
      const query = req.query as unknown as { code: string; state: string };
      const facebookTokenData =
        await this.authService.facebookOAuthCallback(query);
      return response.success({
        message: "Signed in with Facebook successfully",
        data: facebookTokenData,
      });
    } catch (error: any) {
      this._logger.info("An error occured in AuthController", error?.message);
      throw error;
    }
  };
}

const authController = new AuthController(authService, logger);

export default authController;
