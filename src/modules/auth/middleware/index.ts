import { NextFunction, Request, Response } from "express";
import userService from "../../User/service";
import { GenericHelper } from "../../../utils/helpers/generic.helpers";
import ResponseHandler from "../../../utils/helpers/response.handler";
import logger from "../../../config/logger";

interface IAuthMiddleware {
  isValidUsernameAndPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): void;

  isValidEmailAndPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): void;

  checkToken(req: Request, res: Response, next: NextFunction): void;

  isOldAndNewPasswordValid(
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
}

class AuthMiddleware implements IAuthMiddleware {
  async isValidUsernameAndPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    logger.info(
      "---------- AUTH MIDDLEWARE ----------: isValidUsernameAndPassword"
    );
    const { username, password } = req.body;
    const user = (await userService.getUserByUsername(username)) as unknown as {
      password: string;
    };
    if (user) {
      if (GenericHelper.compareHash(password, user.password)) {
        return next();
      }
    }
    res.status(400).send("Invalid username or password");
  }

  async isValidEmailAndPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    logger.info(
      "---------- AUTH MIDDLEWARE ----------: isValidEmailAndPassword"
    );
    const { email, password } = req.body;
    const user = (await userService.getUserByEmail(email)) as unknown as {
      password: string;
    };
    console.log("🚀 ~ AuthMiddleware ~ user:", user);
    if (user) {
      if (GenericHelper.compareHash(password, user.password)) {
        return next();
      }
    }
    res.status(400).send("Invalid email or password");
  }

  async checkToken(req: Request, res: Response, next: NextFunction) {
    logger.info("---------- AUTH MIDDLEWARE ----------: checkToken");
    const responseHandler = new ResponseHandler(req, res);
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return responseHandler.fail({
          message: "Unauthorized",
          data: null,
          code: 401,
        });
      }
      const token = authorization.split(" ")[1];
      if (!token) {
        return responseHandler.fail({
          message: "Unauthorized",
          data: null,
          code: 401,
        });
      }
      const tokenObject = GenericHelper.decryptJwt(token) as { id: string };
      const user = await userService.getUserById(tokenObject?.id);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (error) {
      return responseHandler.fail({
        message: "Unauthorized - token error",
        data: null,
        code: 401,
      });
    }
  }

  async isOldAndNewPasswordValid(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    logger.info(
      "---------- AUTH MIDDLEWARE ----------: isOldAndNewPasswordValid"
    );
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const responseHandler = new ResponseHandler(req, res);
    try {
      const user = (await userService.getUserByEmail(
        req.user?.email as string
      )) as unknown as { password: string };
      if (!GenericHelper.compareHash(oldPassword, user.password)) {
        return responseHandler.fail({
          message: "Incorrect password",
          data: null,
          code: 403,
        });
      }
      if (newPassword !== confirmPassword) {
        return responseHandler.fail({
          message: "Passwords do not match",
          data: null,
          code: 400,
        });
      }

      console.log(
        "🚀 ~ AuthMiddleware ~ GenericHelper.isValidPassword(newPassword):",
        GenericHelper.isValidPassword(newPassword)
      );
      if (!GenericHelper.isValidPassword(newPassword)) {
        return responseHandler.fail({
          message: "Password is invalid - weak password",
          data: null,
          code: 400,
        });
      }

      console.log("Password is valid");
      return next();
    } catch (error) {
      return responseHandler.fail({
        message: "Password is invalid",
        data: error,
        code: 500,
      });
    }
  }
}

const authMiddleware = new AuthMiddleware();

export default authMiddleware;
