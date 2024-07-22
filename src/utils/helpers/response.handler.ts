import { Request, Response as expressResponse } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import ENVS from "../../config/envs";

interface IResponseType {
  message: string;
  status?: number;
  code?: number;
  data: unknown;
}

class ResponseHandler {
  private readonly domain: string;
  private readonly environment: string;
  private readonly request: Request;
  private readonly response: expressResponse;
  constructor(req: Request, res: expressResponse) {
    this.domain = ENVS.API_DOMAIN as string;
    this.environment = ENVS.NODE_ENV as string;
    this.request = req;
    this.response = res;
  }

  success(options: IResponseType): object {
    const { message, data, code = StatusCodes.OK } = options;
    const currentUrl = `${this.domain}${this.request.originalUrl}`;
    const response = {
      url: currentUrl,
      status: "success",
      message,
      data,
      type: getReasonPhrase(code),
    };

    return this.response.status(code).json(response);
  }

  fail(options: IResponseType): object {
    const { message, data, code = StatusCodes.INTERNAL_SERVER_ERROR } = options;
    const currentUrl = `${this.domain}${this.request.originalUrl}`;

    const response = {
      url: currentUrl,
      status: "error",
      message,
      data,
      type: getReasonPhrase(code),
    };

    return this.response.status(code).json(response);
  }
}

export default ResponseHandler;
