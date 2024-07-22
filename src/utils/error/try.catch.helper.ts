/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";

// a function to wrap our controllers to prevent uncaught(async) errors
export const tryCatch =
  (
    controller: (
      req: Request<any>,
      res: Response<any>,
      next: NextFunction,
    ) => Promise<any>,
  ) =>
    (req: Request, res: Response, next: NextFunction) => {
      controller(req, res, next).catch((error) => {
        console.error(error);
        return next(error);
      });
    };
