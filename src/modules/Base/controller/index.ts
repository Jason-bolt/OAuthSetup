/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import IbaseController from "./Icontroller";
import IBaseService from "../service/Iservice";
import logger from "../../../config/logger";
import authService from "../service";
import ResponseHandler from "../../../utils/helpers/response.handler";
import { StatusCodes } from "http-status-codes";

class BaseController implements IbaseController {
  constructor(
    private authService: IBaseService,
    private _logger: typeof logger
  ) {}
  something(req: Request, res: Response): Promise<object> {
    throw new Error("Method not implemented.");
  }
}

const authController = new BaseController(authService, logger);

export default authController;
