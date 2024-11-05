import express from "express";
import authRouter from "../../modules/Auth/router";

const v1Router = express.Router();
v1Router.use("/auth", authRouter);

export default v1Router;
