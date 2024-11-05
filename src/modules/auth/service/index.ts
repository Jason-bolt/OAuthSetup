/* eslint-disable no-useless-catch */
import IAuthService from "./Iservice";
import db, { DatabaseType } from "../../../config/database";
import logger from "../../../config/logger";
import ENVS from "../../../config/envs";
import { GenericHelper } from "../../../utils/helpers/generic.helpers";
import axios from "axios";
import EmailHelper from "../../../utils/helpers/Email/email.helpers";
import authQueries from "../queries";
import userQueries from "../../User/queries";

class AuthService implements IAuthService {
  constructor(
    private db: DatabaseType,
    private _logger: typeof logger,
    private emailHelper: EmailHelper
  ) {}
  initiateGithubOAuth = async (state: string): Promise<string> => {
    const GITHUB_OAUTH_SCOPES = ["read:user", "user:email"];
    try {
      this._logger.info(
        "---------- AUTH SERVICE ----------: Initiating Github OAuth"
      );

      // Save state to database to be called by the get user by state
      await this.db.none(authQueries.insertProviderAndState, [state, "github"]);

      const scopes = GITHUB_OAUTH_SCOPES.join(" ");
      const GITHUB_OAUTH_CONSENT_SCREEN_URL = `${ENVS.GITHUB_OAUTH_URL}?client_id=${ENVS.GITHUB_CLIENT_ID}&redirect_uri=${ENVS.GITHUB_REDIRECT_URL}&state=${state}&scope=${scopes}`;
      return GITHUB_OAUTH_CONSENT_SCREEN_URL;
    } catch (error) {
      throw error;
    }
  };

  githubOAuthCallback = async (query: {
    code: string;
    state: string;
  }): Promise<object> => {
    try {
      this._logger.info(
        "---------- AUTH SERVICE ----------: Github OAuth callback"
      );
      const { code, state } = query;
      this._logger.info(`Code passed - ${code}`);

      const response = await axios({
        method: "post",
        url: `${ENVS.GITHUB_ACCESS_TOKEN_URL}?client_id=${ENVS.GITHUB_CLIENT_ID}&client_secret=${ENVS.GITHUB_CLIENT_SECRET}&code=${code}&state=${state}&redirect_uri=${ENVS.GITHUB_REDIRECT_URL}`,
        headers: {
          accept: "application/json",
        },
      });

      const { access_token } = response.data as { access_token: string };
      const token_info_response = await axios({
        method: "get",
        url: `${ENVS.GITHUB_TOKEN_INFO_URL}`,
        headers: {
          Authorization: "token " + access_token,
        },
      });

      const userData: {
        email: string;
        name: string;
        avatar_url: string;
      } = (await token_info_response.data) as {
        email: string;
        name: string;
        avatar_url: string;
      };

      if (!userData.email) {
        await this.db.none(authQueries.deleteFromUserState, [state, "github"]);
        return { error: "Github email should be made public" };
      }

      const user = await this.db.oneOrNone(userQueries.getUserByEmail, [
        userData.email,
      ]);

      const userName = userData.name.split(" ");

      if (!user) {
        const ID = GenericHelper.generateId(11, "AP");
        await this.db.none(userQueries.createOauthUser, [
          ID,
          userData.email,
          userName[0],
          userName[1],
          userData.avatar_url,
          true,
          state,
        ]);
      }

      this.emailHelper.sendRegisterEmail({
        email: userData.email,
        firstName: userName[0],
        lastName: userName[1],
      });

      // Information in userData
      // 1. email
      // 2. name
      // 3. avatar_url

      // Create user with ID and store the necessary information
      this._logger.info(`User data - ${JSON.stringify(userData)}`);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  initiateGoogleOAuth = async (state: string): Promise<string> => {
    const GOOGLE_OAUTH_SCOPES = [
      "https%3A//www.googleapis.com/auth/userinfo.email",
      "https%3A//www.googleapis.com/auth/userinfo.profile",
    ];
    try {
      this._logger.info(
        "---------- AUTH SERVICE ----------: Initiating Google OAuth"
      );

      // Save state to database to be called by the get user by state
      await this.db.none(authQueries.insertProviderAndState, [state, "google"]);

      const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
      const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${ENVS.GOOGLE_OAUTH_URL}?client_id=${ENVS.GOOGLE_CLIENT_ID}&redirect_uri=${ENVS.GOOGLE_REDIRECT_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}&prompt=consent`;
      return GOOGLE_OAUTH_CONSENT_SCREEN_URL;
    } catch (error) {
      throw error;
    }
  };

  googleOAuthCallback = async (query: {
    code: string;
    state: string;
  }): Promise<object> => {
    try {
      this._logger.info(
        "---------- AUTH SERVICE ----------: Google OAuth callback"
      );
      const { code, state } = query;
      this._logger.info(`Code passed - ${code}`);

      const data = {
        code,
        state,
        client_id: ENVS.GOOGLE_CLIENT_ID,
        client_secret: ENVS.GOOGLE_CLIENT_SECRET,
        redirect_uri: ENVS.GOOGLE_REDIRECT_URL,
        grant_type: "authorization_code",
      };

      const response = await fetch(ENVS.GOOGLE_ACCESS_TOKEN_URL as string, {
        method: "POST",
        body: JSON.stringify(data),
      });

      const access_token_data = await response.json();

      const { id_token } = access_token_data;
      const token_info_response = await fetch(
        `${ENVS.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`
      );

      const userData = await token_info_response.json();

      const user = await this.db.oneOrNone(userQueries.getUserByEmail, [
        userData.email,
      ]);

      if (!user) {
        const ID = GenericHelper.generateId(11, "AP");
        await this.db.none(userQueries.createOauthUser, [
          ID,
          userData.email,
          userData.given_name,
          userData.family_name,
          userData.picture,
          true,
          state,
        ]);
      }

      this.emailHelper.sendRegisterEmail({
        email: userData.email,
        firstName: userData.given_name,
        lastName: userData.family_name,
      });

      await this.db.none(authQueries.deleteFromUserState, [state, "google"]);

      // Information in userData
      // 1. email
      // 2. name
      // 3. picture
      // 4. email_verified
      // 5. family_name
      // 6. given_name

      // Create user with ID and store the necessary information
      this._logger.info(`User data - ${JSON.stringify(userData)}`);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  initiateFacebookOAuth = async (state: string): Promise<string> => {
    try {
      this._logger.info(
        "---------- AUTH SERVICE ----------: Initiating Facebook OAuth"
      );

      // Save state to database to be called by the get user by state
      await this.db.none(authQueries.insertProviderAndState, [
        state,
        "facebook",
      ]);

      const FACEBOOK_OAUTH_CONSENT_SCREEN_URL = `${ENVS.FACEBOOK_OAUTH_URL}?client_id=${ENVS.FACEBOOK_CLIENT_ID}&redirect_uri=${ENVS.FACEBOOK_REDIRECT_URL}&state=${state}&scope=email&auth_type=reauthenticate`;
      return FACEBOOK_OAUTH_CONSENT_SCREEN_URL;
    } catch (error) {
      throw error;
    }
  };

  facebookOAuthCallback = async (query: {
    code: string;
    state: string;
  }): Promise<object> => {
    try {
      this._logger.info(
        "---------- AUTH SERVICE ----------: Facebook OAuth callback"
      );
      const { code, state } = query;
      this._logger.info(`Code passed - ${code}`);

      const response = await fetch(
        `${ENVS.FACEBOOK_ACCESS_TOKEN_URL}?client_id=${ENVS.FACEBOOK_CLIENT_ID}&redirect_uri=${ENVS.FACEBOOK_REDIRECT_URL}&client_secret=${ENVS.FACEBOOK_CLIENT_SECRET}&code=${code}` as string,
        {
          method: "GET",
        }
      );

      const access_token_data = await response.json();

      const { access_token } = access_token_data;
      const token_info_response = await fetch(
        `${ENVS.FACEBOOK_TOKEN_INFO_URL}?access_token=${access_token}&fields=name,email,picture`
      );

      const userData = await token_info_response.json();
      console.log(userData);

      const userName = userData.name.split(" ");

      const user = await this.db.oneOrNone(userQueries.getUserByEmail, [
        userData.email,
      ]);

      if (!user) {
        const ID = GenericHelper.generateId(11, "AP");
        await this.db.none(userQueries.createOauthUser, [
          ID,
          userData.email,
          userName[0],
          userName[1],
          userData.picture?.data?.url,
          true,
          state,
        ]);
      }

      await this.db.none(authQueries.deleteFromUserState, [state, "facebook"]);

      // Information in userData
      // 1. email
      // 2. name
      // 3. picture -> url
      // 4. email_verified

      // Create user with ID and store the necessary information
      this._logger.info(`User data - ${JSON.stringify(userData)}`);
      return userData;
    } catch (error) {
      throw error;
    }
  };
}

const emailHelper = new EmailHelper();
emailHelper.init();
const authService = new AuthService(db, logger, emailHelper);

export default authService;
