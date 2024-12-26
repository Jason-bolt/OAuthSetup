/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import IUserController from "./Icontroller";
import IUserService from "../service/Iservice";
import logger from "../../../config/logger";
import authService from "../service";
import ResponseHandler from "../../../utils/helpers/response.handler";
import { StatusCodes } from "http-status-codes";

class UserController implements IUserController {
  constructor(
    private userService: IUserService,
    private _logger: typeof logger,
  ) {}
  getUserById = async (req: Request, res: Response): Promise<object> => {
    this._logger.info("---------- USER CONTROLLER ----------: getUserById");

    const response = new ResponseHandler(req, res);
    const id = req.params.id as string;
    const user = await this.userService.getUserById(id);
    return response.success({
      message: "User fetched!",
      data: user,
    });
  };

  getUserByEmail = async (req: Request, res: Response): Promise<object> => {
    this._logger.info("---------- USER CONTROLLER ----------: getUserById");

    const response = new ResponseHandler(req, res);
    const email = req.params.email as string;
    const user = await this.userService.getUserByEmail(email);
    return response.success({
      message: "User fetched!",
      data: user,
    });
  };
}

const baseController = new UserController(authService, logger);

export default baseController;
