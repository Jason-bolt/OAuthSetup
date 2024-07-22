import IOauthService from "./Iservice";
import db, { DatabaseType } from "../../../config/database";
import logger from "../../../config/logger";
import ENVS from "../../../config/envs";
import { GenericHelper } from "../../../utils/helpers/generic.helpers";

class OauthService implements IOauthService {
  constructor(
    private db: DatabaseType,
    private _logger: typeof logger
  ) {}

  initiateGoogleOAuth = async (state: string): Promise<string> => {
    const GOOGLE_OAUTH_SCOPES = [
      "https%3A//www.googleapis.com/auth/userinfo.email",
      "https%3A//www.googleapis.com/auth/userinfo.profile",
    ];
    try {
      this._logger.info(
        "---------- OAUTHSERVICE ----------: Initiating Google OAuth"
      );

      // Save state to database to be called by the get user by state
      await this.db.none(
        "INSERT INTO user_states (state, provider) VALUES ($1, $2)",
        [state, "google"]
      );

      const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
      const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${ENVS.GOOGLE_OAUTH_URL}?client_id=${ENVS.GOOGLE_CLIENT_ID}&redirect_uri=${ENVS.GOOGLE_REDIRECT_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}&prompt=consent`;
      return GOOGLE_OAUTH_CONSENT_SCREEN_URL;
    } catch (error) {
      throw error;
    }
  };

  googleOAuthCallback = async (query: any): Promise<object> => {
    try {
      this._logger.info(
        "---------- OAUTHSERVICE ----------: Google OAuth callback"
      );
      const { code, state } = query;
      this._logger.info(`Code passed - ${code}`);

      const data = {
        code,
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

      const user = await this.db.oneOrNone(
        `SELECT * FROM users WHERE email = $1`,
        [userData.email]
      );

      if (!user) {
        const ID = GenericHelper.generateId(11);
        await this.db.none(
          `INSERT INTO users (id, email, first_name, last_name, image_url, email_verified) VALUES ($1, $2, $3, $4, $5, $6);
          UPDATE user_states SET email = $2 WHERE state = $7;
          `,
          [
            ID,
            userData.email,
            userData.given_name,
            userData.family_name,
            userData.picture,
            true,
            state,
          ]
        );
      }

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
        "---------- OAUTHSERVICE ----------: Initiating Facebook OAuth"
      );

      // Save state to database to be called by the get user by state
      await this.db.none(
        "INSERT INTO user_states (state, provider) VALUES ($1, $2)",
        [state, "facebook"]
      );

      const FACEBOOK_OAUTH_CONSENT_SCREEN_URL = `${ENVS.FACEBOOK_OAUTH_URL}?client_id=${ENVS.FACEBOOK_CLIENT_ID}&redirect_uri=${ENVS.FACEBOOK_REDIRECT_URL}&state=${state}&scope=email&auth_type=reauthenticate`;
      return FACEBOOK_OAUTH_CONSENT_SCREEN_URL;
    } catch (error) {
      throw error;
    }
  };

  facebookOAuthCallback = async (query: any): Promise<object> => {
    try {
      this._logger.info(
        "---------- OAUTHSERVICE ----------: Facebook OAuth callback"
      );
      const { code, state } = query;
      this._logger.info(`Code passed - ${code}`);

      const response = await fetch(`${ENVS.FACEBOOK_ACCESS_TOKEN_URL}?client_id=${ENVS.FACEBOOK_CLIENT_ID}&redirect_uri=${ENVS.FACEBOOK_REDIRECT_URL}&client_secret=${ENVS.FACEBOOK_CLIENT_SECRET}&code=${code}` as string, {
        method: "GET"
      });

      const access_token_data = await response.json();

      const { access_token } = access_token_data;
      const token_info_response = await fetch(
        `${ENVS.FACEBOOK_TOKEN_INFO_URL}?access_token=${access_token}&fields=name,email,picture`
      );

      const userData = await token_info_response.json();
      console.log(userData);

      const userName = userData.name.split(" ");

      const user = await this.db.oneOrNone(
        `SELECT * FROM users WHERE email = $1`,
        [userData.email]
      );

      if (!user) {
        const ID = GenericHelper.generateId(11);
        await this.db.none(
          `INSERT INTO users (id, email, first_name, last_name, image_url, email_verified) VALUES ($1, $2, $3, $4, $5, $6);
          UPDATE user_states SET email = $2 WHERE state = $7;
          `,
          [
            ID,
            userData.email,
            userName[0],
            userName[1],
            userData.picture?.data?.url,
            true,
            state,
          ]
        );
      }

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

const oauthService = new OauthService(db, logger);

export default oauthService;
