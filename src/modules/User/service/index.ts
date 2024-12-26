/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import IUserService from "./Iservice";
import db, { DatabaseType } from "../../../config/database";
import logger from "../../../config/logger";
import ENVS from "../../../config/envs";
import { GenericHelper } from "../../../utils/helpers/generic.helpers";
import EmailHelper from "../../../utils/helpers/Email/email.helpers";
import userQueries from "../queries";
import { IUser } from "../../../config/models/User";

class UserService implements IUserService {
  constructor(
    private db: DatabaseType,
    private _logger: typeof logger,
    private emailHelper: EmailHelper,
  ) {}
  getUserById = async (id: string): Promise<IUser> => {
    this._logger.info("---------- USER SERVICE ----------: getUserById");
    const user = await this.db.oneOrNone(userQueries.getUserById, [id]);
    return user;
  };

  getUserByEmail = async (email: string): Promise<object> => {
    this._logger.info("---------- USER SERVICE ----------: getUserByEmail");
    const user = await this.db.oneOrNone(userQueries.getUserByEmail, [email]);
    return user;
  };

  getUserByUsername = async (username: string): Promise<IUser> => {
    this._logger.info("---------- USER SERVICE ----------: getUserByUsername");
    const user = await this.db.oneOrNone(userQueries.getUserByUsername, [
      username,
    ]);
    return user;
  };
}

const emailHelper = new EmailHelper();
emailHelper.init();
const userService = new UserService(db, logger, emailHelper);

export default userService;
