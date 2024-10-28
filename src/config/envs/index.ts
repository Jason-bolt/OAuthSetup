import dotenv from 'dotenv';
dotenv.config();

interface IENVS {
  API_DOMAIN: string | undefined;
  NODE_ENV: string | undefined;
  PORT: string | undefined;
  DATABASE_URL: string | undefined;
  TOKEN_EXPIRY: string | undefined;
  TOKEN_SECRET: string | undefined;
  GOOGLE_REDIRECT_URL: string | undefined;
  GOOGLE_CLIENT_ID: string | undefined;
  GOOGLE_CLIENT_SECRET: string | undefined;
  GOOGLE_OAUTH_URL: string | undefined;
  GOOGLE_ACCESS_TOKEN_URL: string | undefined;
  GOOGLE_TOKEN_INFO_URL: string | undefined;
  FACEBOOK_CLIENT_ID: string | undefined;
  FACEBOOK_CLIENT_SECRET: string | undefined;
  FACEBOOK_OAUTH_URL: string | undefined;
  FACEBOOK_REDIRECT_URL: string | undefined;
  FACEBOOK_ACCESS_TOKEN_URL: string | undefined;
  FACEBOOK_TOKEN_INFO_URL: string | undefined;
  GITHUB_CLIENT_ID: string | undefined;
  GITHUB_CLIENT_SECRET: string | undefined;
  GITHUB_OAUTH_URL: string | undefined;
  GITHUB_REDIRECT_URL: string | undefined;
  GITHUB_ACCESS_TOKEN_URL: string | undefined;
  GITHUB_TOKEN_INFO_URL: string | undefined;
}

const ENVS: IENVS = {
  API_DOMAIN: process.env.API_DOMAIN,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  TOKEN_EXPIRY: process.env.TOKEN_EXPIRY,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  // GOOGLE OAUTH
  GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_OAUTH_URL: process.env.GOOGLE_OAUTH_URL,
  GOOGLE_ACCESS_TOKEN_URL: process.env.GOOGLE_ACCESS_TOKEN_URL,
  GOOGLE_TOKEN_INFO_URL: process.env.GOOGLE_TOKEN_INFO_URL,
  // FACEBOOK OAUTH
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  FACEBOOK_OAUTH_URL: process.env.FACEBOOK_OAUTH_URL,
  FACEBOOK_REDIRECT_URL: process.env.FACEBOOK_REDIRECT_URL,
  FACEBOOK_ACCESS_TOKEN_URL: process.env.FACEBOOK_ACCESS_TOKEN_URL,
  FACEBOOK_TOKEN_INFO_URL: process.env.FACEBOOK_TOKEN_INFO_URL,
  // GITHUB OAUTH
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_OAUTH_URL: process.env.GITHUB_OAUTH_URL,
  GITHUB_REDIRECT_URL: process.env.GITHUB_REDIRECT_URL,
  GITHUB_ACCESS_TOKEN_URL: process.env.GITHUB_ACCESS_TOKEN_URL,
  GITHUB_TOKEN_INFO_URL: process.env.GITHUB_TOKEN_INFO_URL,
}

export default ENVS;