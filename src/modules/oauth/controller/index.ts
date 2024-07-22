import { Request, Response } from "express";
import IOauthController from "./Icontroller";
import IOauthService from "../service/Iservice";
import logger from "../../../config/logger";
import oauthService from "../service";
import ResponseHandler from "../../../utils/helpers/response.handler";
import { StatusCodes } from "http-status-codes";

class OauthController implements IOauthController {
  constructor(
    private oauthService: IOauthService,
    private _logger: typeof logger
  ) {}

  initiateGoogleOAuth = async (
    req: Request,
    res: Response
  ): Promise<object> => {
    try {
      this._logger.info(
        "---------- OAUTHCONTROLLER ----------: Initiating Google OAuth"
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
        await this.oauthService.initiateGoogleOAuth(state);
      return response.success({
        message: "Google OAuth link generated successfully",
        data: googleInitiationLink,
      });
    } catch (error: any) {
      this._logger.info("An error occured in OauthController", error?.message);
      throw error;
    }
  };

  googleOAuthCallback = async (
    req: Request,
    res: Response
  ): Promise<object> => {
    try {
      this._logger.info(
        "---------- OAUTHCONTROLLER ----------: Completing Google OAuth"
      );
      const response = new ResponseHandler(req, res);
      const query = req.query;
      const googleTokenData =
        await this.oauthService.googleOAuthCallback(query);
      return response.success({
        message: "Signed in with Google successfully",
        data: googleTokenData,
      });
    } catch (error: any) {
      this._logger.info("An error occured in OauthController", error?.message);
      throw error;
    }
  };
  
  initiateFacebookOAuth = async (
    req: Request,
    res: Response
  ): Promise<object> => {
    try {
      this._logger.info(
        "---------- OAUTHCONTROLLER ----------: Initiating Facebook OAuth"
      );
      const response = new ResponseHandler(req, res);
      const state = req.query.state as string;
      const facebookInitiationLink =
        await this.oauthService.initiateFacebookOAuth(state);
      return response.success({
        message: "Facebook OAuth link generated successfully",
        data: facebookInitiationLink,
      });
    } catch (error: any) {
      this._logger.info("An error occured in OauthController", error?.message);
      throw error;
    }
  };

  facebookOAuthCallback = async (
    req: Request,
    res: Response
  ): Promise<object> => {
    try {
      this._logger.info(
        "---------- OAUTHCONTROLLER ----------: Completing Facebook OAuth"
      );
      const response = new ResponseHandler(req, res);
      const query = req.query;
      const facebookTokenData =
        await this.oauthService.facebookOAuthCallback(query);
      return response.success({
        message: "Signed in with Facebook successfully",
        data: facebookTokenData,
      });
    } catch (error: any) {
      this._logger.info("An error occured in OauthController", error?.message);
      throw error;
    }
  };
}

const oauthController = new OauthController(oauthService, logger);

export default oauthController;
