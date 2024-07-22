import express from "express";
import oauthRouter from "../../modules/oauth/router";

const v1Router = express.Router();
v1Router.use("/auth", oauthRouter);

export default v1Router;
