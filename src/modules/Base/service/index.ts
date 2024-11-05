/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import IBaseService from "./Iservice";
import db, { DatabaseType } from "../../../config/database";
import logger from "../../../config/logger";
import ENVS from "../../../config/envs";
import { GenericHelper } from "../../../utils/helpers/generic.helpers";
import EmailHelper from "../../../utils/helpers/Email/email.helpers";

class BaseService implements IBaseService {
  constructor(
    private db: DatabaseType,
    private _logger: typeof logger,
    private emailHelper: EmailHelper,
  ) {}
  something(): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

const emailHelper = new EmailHelper();
emailHelper.init();
const baseService = new BaseService(db, logger, emailHelper);

export default baseService;
