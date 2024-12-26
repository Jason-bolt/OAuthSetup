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

  isValidRegisterationBody(
    req: Request,
    res: Response,
    next: NextFunction
  ): void;

  isUniqueEmail(req: Request, res: Response, next: NextFunction): void;

  isUniqueUsername(req: Request, res: Response, next: NextFunction): void;

  isValidRegistrationPassowrd(
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
  async isValidRegisterationBody(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    logger.info(
      "---------- AUTH MIDDLEWARE ----------: isValidRegisterationBody"
    );
    const responseHandler = new ResponseHandler(req, res);
    const {
      email,
      username,
      password,
      confirmPassword,
      first_name,
      last_name,
    } = req.body;
    const isValidFields = GenericHelper.verifyFields(
      {
        email,
        username,
        password,
        confirmPassword,
        first_name,
        last_name,
      },
      {
        email: { type: "string", required: true },
        username: { type: "string", required: true },
        password: { type: "string", required: true },
        confirmPassword: { type: "string", required: true },
        first_name: { type: "string", required: true },
        last_name: { type: "string", required: true },
      }
    );

    if (!isValidFields.isValid) {
      return responseHandler.fail({
        message: "Invalid fields",
        data: isValidFields.errors,
        code: 400,
      });
    }
    return next();
  }

  async isUniqueEmail(req: Request, res: Response, next: NextFunction) {
    logger.info("---------- AUTH MIDDLEWARE ----------: isUniqueEmail");
    const responseHandler = new ResponseHandler(req, res);
    try {
      const { email } = req.body;
      const user = await userService.getUserByEmail(email);

      if (user) {
        return responseHandler.fail({
          message: "Email already exists",
          data: null,
          code: 400,
        });
      }

      return next();
    } catch (error) {
      return responseHandler.fail({
        message: "Error checking email",
        data: null,
        code: 500,
      });
    }
  }

  async isUniqueUsername(req: Request, res: Response, next: NextFunction) {
    logger.info("---------- AUTH MIDDLEWARE ----------: isUniqueUsername");
    const responseHandler = new ResponseHandler(req, res);
    try {
      const { email } = req.body;
      const user = await userService.getUserByUsername(email);

      if (user) {
        return responseHandler.fail({
          message: "Username already exists",
          data: null,
          code: 400,
        });
      }

      return next();
    } catch (error) {
      return responseHandler.fail({
        message: "Error checking username",
        data: null,
        code: 500,
      });
    }
  }

  async isValidRegistrationPassowrd(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    logger.info(
      "---------- AUTH MIDDLEWARE ----------: isValidRegistrationPassowrd"
    );
    const responseHandler = new ResponseHandler(req, res);
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return responseHandler.fail({
        message: "Passwords do not match",
        data: null,
        code: 400,
      });
    }

    if (!GenericHelper.isValidPassword(password)) {
      return responseHandler.fail({
        message: "Password is invalid - weak password",
        data: null,
        code: 400,
      });
    }

    return next();
  }

  async isValidUsernameAndPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    logger.info(
      "---------- AUTH MIDDLEWARE ----------: isValidUsernameAndPassword"
    );
    const responseHandler = new ResponseHandler(req, res);
    const { username, password } = req.body;
    const user = (await userService.getUserByUsername(username)) as unknown as {
      password: string;
    };
    if (user) {
      if (GenericHelper.compareHash(password, user.password)) {
        return next();
      }
    }
    return responseHandler.fail({
      message: "invalid username or password",
      data: null,
      code: 400,
    });
  }

  async isValidEmailAndPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    logger.info(
      "---------- AUTH MIDDLEWARE ----------: isValidEmailAndPassword"
    );
    const responseHandler = new ResponseHandler(req, res);
    const { email, password } = req.body;
    const user = (await userService.getUserByEmail(email)) as unknown as {
      password: string;
    };
    if (user) {
      if (GenericHelper.compareHash(password, user.password)) {
        return next();
      }
    }
    return responseHandler.fail({
      message: "Invalid email or password",
      data: null,
      code: 400,
    });
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
